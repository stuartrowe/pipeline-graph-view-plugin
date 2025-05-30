package io.jenkins.plugins.pipelinegraphview.utils;

import io.jenkins.plugins.pipelinegraphview.analysis.TimingInfo;

public class PipelineStep extends AbstractPipelineNode {
    private String stageId;

    public PipelineStep(
            String id,
            String name,
            PipelineState state,
            String type,
            String title,
            String stageId,
            TimingInfo timingInfo) {
        super(id, name, state, type, title, timingInfo);
        this.stageId = stageId;
    }

    public String getStageId() {
        return stageId;
    }
}
