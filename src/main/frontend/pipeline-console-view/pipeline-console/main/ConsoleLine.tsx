import React from "react";
import { forwardRef } from "react";
import { makeReactChildren, tokenizeANSIString } from "./Ansi";

export interface ConsoleLineProps {
  lineNumber: string;
  content: string;
  stepId: string;
  startByte: number;
}

// Console output line
export const ConsoleLine = forwardRef<HTMLDivElement, React.PropsWithChildren<ConsoleLineProps>>(function ConsoleLine(props: ConsoleLineProps, ref) {
  return (
    <>
      <pre
        className="console-output-line"
        key={`console-line-pre${props.lineNumber}`}
      >
        <div
          className="console-output-line-anchor"
          id={`log-${props.lineNumber}`}
          key={`${props.lineNumber}-anchor`}
        />
        <div className="console-output-line" key={`${props.lineNumber}-body`} ref={ref}>
          <a
            className="console-line-number"
            href={`?start-byte=${props.startByte}&selected-node=${props.stepId}#log-${props.lineNumber}`} //`}
          >
            {props.lineNumber}
          </a>
          <div className="console-text">
            {makeReactChildren(
              tokenizeANSIString(props.content),
              `${props.stepId}-${props.lineNumber}`
            )}
          </div>
        </div>
      </pre>
    </>
  )
});