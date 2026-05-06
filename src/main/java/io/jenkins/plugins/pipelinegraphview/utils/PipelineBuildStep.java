package io.jenkins.plugins.pipelinegraphview.utils;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonBeanProcessor;

public record PipelineBuildStep(String classicUrl, String pipelineViewUrl, String displayName) {
    public static class PipelineBuildStepJsonProcessor implements JsonBeanProcessor {
        @Override
        public JSONObject processBean(Object bean, JsonConfig jsonConfig) {
            if (!(bean instanceof PipelineBuildStep build)) {
                return null;
            }
            JSONObject json = new JSONObject();
            json.element("classicUrl", build.classicUrl());
            json.element("pipelineViewUrl", build.pipelineViewUrl());
            json.element("displayName", build.displayName());
            return json;
        }

        public static void configure(JsonConfig config) {
            config.registerJsonBeanProcessor(PipelineBuildStep.class, new PipelineBuildStepJsonProcessor());
        }
    }
}
