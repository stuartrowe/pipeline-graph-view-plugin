import linkifyHtml from "linkify-html";
import { memo, useEffect, useRef } from "react";

import { makeReactChildren, tokenizeANSIString } from "./Ansi.tsx";

export interface ConsoleLineProps {
  lineNumber: string;
  content: string;
  stepId: string;
  startByte: number;
  heightCallback: (height: number) => void;
}

declare global {
  interface Window {
    Behaviour: any;
  }
}

// Console output line
export const ConsoleLine = memo(function ConsoleLine(props: ConsoleLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const height = ref.current ? ref.current.getBoundingClientRect().height : 0;
    props.heightCallback(height);

    // apply any behaviour selectors to the new content, e.g. for input step
    window.Behaviour.applySubtree(
      document.getElementById(`${props.stepId}-${props.lineNumber}`),
    );
  }, []);

  return (
    <pre
      style={{ background: "none", border: "none" }}
      className="console-output-line"
      key={`console-line-pre${props.lineNumber}`}
    >
      <div
        className="console-output-line"
        key={`${props.lineNumber}-body`}
        ref={ref}
      >
        <a
          className="console-line-number"
          id={`log-${props.lineNumber}`}
          href={`?start-byte=${props.startByte}&selected-node=${props.stepId}#log-${props.lineNumber}`}
          style={{
            width: Math.max(9 * String(props.lineNumber).length, 30) + "px",
          }}
        >
          {props.lineNumber}
        </a>
        <div
          id={`${props.stepId}-${props.lineNumber}`}
          className="console-text"
        >
          {makeReactChildren(
            tokenizeANSIString(linkifyHtml(props.content)),
            `${props.stepId}-${props.lineNumber}`,
          )}
        </div>
      </div>
    </pre>
  );
});
