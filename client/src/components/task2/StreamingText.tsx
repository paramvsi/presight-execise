interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  isComplete: boolean;
}

export function StreamingText({ text, isStreaming, isComplete }: StreamingTextProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {text}
        {isStreaming && (
          <span className="inline-block w-2 h-5 bg-blue-600 ml-0.5 cursor-blink" />
        )}
      </div>
      {isComplete && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-green-600">
          Stream complete! ({text.length} characters)
        </div>
      )}
    </div>
  );
}
