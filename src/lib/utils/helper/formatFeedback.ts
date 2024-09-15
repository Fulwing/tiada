export function formatFeedback(feedbackString: string): string {
    try {
      // Parse the JSON string
      const parsed = JSON.parse(feedbackString);
      
      // Extract the feedback content
      let feedback = parsed.feedback;
      
      // Remove the initial markdown header
      feedback = feedback.replace(/^### /, '');
      
      // Replace \n\n or \n \n with actual newline characters
      feedback = feedback.replace(/\\n/g, '\n');

      // Replace **text** with <strong>text</strong> for bold formatting
      feedback = feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Split the text into paragraphs
      const paragraphs = feedback.split(/\n\s*\n/);

      // Wrap each paragraph in a <p> tag
      return paragraphs.map((para: string) => `<p>${para.trim()}</p>`).join('');

    } catch (error) {
      console.error("Error parsing feedback:", error);
      return feedbackString; // Return original string if parsing fails
    }
  }
  