"""Pipeline run record persistence.

Creates, saves, loads, and updates PipelineRun records on disk. Each run is
persisted as a JSON file under runs/<run_id>.json. The RunRecordManager is the
only place in the codebase that reads or writes those files.
"""

import json
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_PIPELINE_DIR = Path(__file__).resolve().parent.parent
if str(_PIPELINE_DIR) not in sys.path:
    sys.path.insert(0, str(_PIPELINE_DIR))

from contracts.pipeline_run import AgentRunRecord, PipelineRun, PipelineState  # noqa: E402

# Absolute path to the runs/ directory at the repository root.
RUNS_DIR: Path = Path(__file__).resolve().parents[2] / "runs"


class RunNotFoundError(Exception):
    """Raised when a run_id does not correspond to a file in RUNS_DIR."""


class RunRecordManager:
    """Creates, persists, and mutates PipelineRun records.

    Instantiating this class ensures RUNS_DIR exists. All disk I/O for run
    records is funnelled through this class — no other module writes to runs/.
    """

    def __init__(self) -> None:
        RUNS_DIR.mkdir(parents=True, exist_ok=True)

    def create(self, work_item_id: str, work_item_title: str) -> PipelineRun:
        """Create a new PipelineRun, persist it, and return it.

        The run is initialised with a generated UUID, the current UTC time as
        started_at, and PipelineState.pending_clarification as the initial state.

        Args:
            work_item_id: ADO work item ID that triggered this pipeline run.
            work_item_title: Title of the ADO work item.

        Returns:
            A freshly created and persisted PipelineRun.
        """
        run = PipelineRun(
            run_id=str(uuid.uuid4()),
            work_item_id=work_item_id,
            work_item_title=work_item_title,
            state=PipelineState.pending_clarification,
            started_at=datetime.now(timezone.utc),
        )
        self.save(run)
        return run

    def save(self, run: PipelineRun) -> None:
        """Serialize run to JSON and write it to runs/<run_id>.json.

        Overwrites any existing file for the same run_id. Uses Pydantic's
        model_dump with mode="json" so datetime and enum values serialize
        correctly without a custom encoder.

        Args:
            run: The pipeline run to persist.
        """
        record_path = self._path_for(run.run_id)
        record_path.write_text(
            json.dumps(run.model_dump(mode="json"), indent=2),
            encoding="utf-8",
        )

    def load(self, run_id: str) -> PipelineRun:
        """Deserialize and return the PipelineRun stored at runs/<run_id>.json.

        Args:
            run_id: The UUID of the run to load.

        Returns:
            The deserialized PipelineRun.

        Raises:
            RunNotFoundError: If runs/<run_id>.json does not exist.
        """
        record_path = self._path_for(run_id)
        if not record_path.exists():
            raise RunNotFoundError(
                f"No run record found for run_id={run_id!r} at {record_path}"
            )
        raw = json.loads(record_path.read_text(encoding="utf-8"))
        return PipelineRun.model_validate(raw)

    def list_runs(self) -> list[str]:
        """Return all run_ids found in RUNS_DIR.

        Derives run_ids from filenames — each .json file stem is treated as a
        run_id. The .gitkeep placeholder is excluded automatically because it
        does not end in .json.

        Returns:
            List of run_id strings, unsorted.
        """
        return [p.stem for p in RUNS_DIR.glob("*.json")]

    def mark_agent_complete(
        self,
        run: PipelineRun,
        agent_name: str,
        success: bool,
        error: str | None,
    ) -> PipelineRun:
        """Finalise the AgentRunRecord for agent_name on run.

        Finds the most recent AgentRunRecord whose agent_name matches, sets its
        completed_at to now and its success and error_message fields, then saves
        the run to disk.

        Args:
            run: The pipeline run to update.
            agent_name: Name of the agent that finished (must match an existing
                AgentRunRecord on the run).
            success: True if the agent completed without error or timeout.
            error: Error detail string, or None when success is True.

        Returns:
            The same run object with the matching AgentRunRecord updated.

        Raises:
            ValueError: If no AgentRunRecord with the given agent_name exists on run.
        """
        record = self._find_agent_record(run, agent_name)
        record.completed_at = datetime.now(timezone.utc)
        record.success = success
        record.error_message = error
        self.save(run)
        return run

    def _path_for(self, run_id: str) -> Path:
        """Return the absolute path to the JSON file for run_id.

        Args:
            run_id: The UUID identifying the run.

        Returns:
            Path object pointing to runs/<run_id>.json.
        """
        return RUNS_DIR / f"{run_id}.json"

    def _find_agent_record(self, run: PipelineRun, agent_name: str) -> AgentRunRecord:
        """Return the most recent AgentRunRecord matching agent_name.

        Iterates in reverse so that if an agent was retried, the latest attempt
        is returned rather than the first failed one.

        Args:
            run: The pipeline run to search.
            agent_name: The agent_name to match.

        Returns:
            The matching AgentRunRecord.

        Raises:
            ValueError: If no matching record is found.
        """
        for record in reversed(run.agent_runs):
            if record.agent_name == agent_name:
                return record
        raise ValueError(
            f"No AgentRunRecord found for agent_name={agent_name!r} on run_id={run.run_id!r}"
        )


__all__: list[Any] = ["RunNotFoundError", "RUNS_DIR", "RunRecordManager"]
