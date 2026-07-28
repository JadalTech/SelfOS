/**
 * Streaming Response Controller
 * SelfOS v2.0.0 — Batch 13B
 */

export class StreamingController {
  private isStreaming = false;

  startStream(onChunk: (chunk: string) => void, onComplete: () => void): void {
    this.isStreaming = true;
    const fullText = 'Analyzing your unified health score... Your sleep consistency score is up by 12%!';
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullText.length && this.isStreaming) {
        onChunk(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        this.isStreaming = false;
        onComplete();
      }
    }, 20);
  }

  cancelStream(): void {
    this.isStreaming = false;
  }
}

export const streamingController = new StreamingController();
export default streamingController;
