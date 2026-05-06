import { useEffect, useRef, useState } from "react";

import StatusIcon from "../../../../common/components/status-icon.tsx";
import { StepInfo } from "../../../../common/RestClient.tsx";
import { POLL_INTERVAL, Result } from "../PipelineConsoleModel.tsx";

declare global {
  const Behaviour:
    | { applySubtree: (element: Element, includeSelf?: boolean) => void }
    | undefined;
}

function resultFromApi(
  result: string | null,
  building: boolean,
): Result {
  if (building) return Result.running;
  switch (result) {
    case "SUCCESS":
      return Result.success;
    case "UNSTABLE":
      return Result.unstable;
    case "FAILURE":
      return Result.failure;
    case "ABORTED":
      return Result.aborted;
    case "NOT_BUILT":
      return Result.not_built;
    default:
      return Result.unknown;
  }
}

export default function BuildStep({ step }: { step: StepInfo }) {
  const buildStep = step.buildStep!;
  const [state, setState] = useState<Result>(Result.running);
  const [complete, setComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch(`${buildStep.runUrl}api/json?tree=result,building`)
        .then((res) => res.json())
        .then(({ result, building }) => {
          setState(resultFromApi(result, building));
          if (!building) {
            setComplete(true);
          }
        })
        .catch((e) => {
          console.error("Failed to fetch downstream build status", e);
          setState(Result.unknown);
        });
    };

    fetchStatus();

    if (complete) return;
    const interval = window.setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [buildStep.runUrl, complete]);

  useEffect(() => {
    if (!containerRef.current) return;
    // Trigger Jenkins' A.model-link behavior to inject the dropdown chevron
    // inside the anchor element, and the .jenkins-menu-dropdown-chevron behavior
    // to attach the tippy dropdown to it.
    Behaviour?.applySubtree(containerRef.current, true);
    // The injected chevron's data-href defaults to the anchor's href (stages URL).
    // Override it to the base build URL so the contextMenu fetch resolves correctly.
    const chevron = containerRef.current.querySelector<HTMLElement>(
      ".jenkins-menu-dropdown-chevron",
    );
    if (chevron) {
      chevron.dataset.href = buildStep.runUrl;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="pgv-build-step">
      <div className="pgv-step-detail-header__content">
        <StatusIcon status={state} />
        <a className="jenkins-table__link jenkins-table__badge model-link model-link inside" href={buildStep.url}>
          {buildStep.displayName}
        </a>
      </div>
    </div>
  );
}
