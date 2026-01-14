/**
 * OpenTelemetry Instrumentation for Watshibo AI Platform
 * Automatically traces all AI operations, HTTP requests, and database queries
 */
export async function register() {
  // Only run instrumentation in Node.js environment (not Edge Runtime)
  if (typeof process === 'undefined' || !process.env) {
    console.log('⚠️ Skipping OpenTelemetry in Edge Runtime');
    return;
  }

  try {
    // Dynamic imports to avoid Edge Runtime issues
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');

    const sdk = new NodeSDK({
      serviceName: 'watshibo-ai-interview-platform',
      traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-http': {
            enabled: true,
          },
          '@opentelemetry/instrumentation-fetch': {
            enabled: true,
          },
        }),
      ],
    });

    await sdk.start();
    console.log('🔍 OpenTelemetry tracing started successfully');
    console.log('📊 Sending traces to: http://localhost:4318');
    console.log('🎯 Service: watshibo-ai-interview-platform');
  } catch (error) {
    console.error('Failed to start OpenTelemetry tracing:', error);
  }
}
