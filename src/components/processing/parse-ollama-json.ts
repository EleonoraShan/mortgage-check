export const parseOllamaJson = (content:string) => {
      // Ollama should return raw JSON.  Parse defensively.
      let json;
      try {
        json = JSON.parse(content);
      } catch (e) {
        console.log('Initial JSON parse failed, trying to extract JSON from content:', content);
        // Try to find JSON array first [.*], then JSON object {.*}
        const arrayMatch = content.match(/\[.*\]/s);
        const objectMatch = content.match(/{.*}/s);
        
        if (arrayMatch) {
          try {
            json = JSON.parse(arrayMatch[0]);
          } catch (arrayError) {
            console.log('Array parse failed:', arrayError);
            json = [];
          }
        } else if (objectMatch) {
          try {
            json = JSON.parse(objectMatch[0]);
          } catch (objectError) {
            console.log('Object parse failed:', objectError);
            json = {};
          }
        } else {
          console.log('No JSON found in content, returning empty array');
          json = [];
        }
      }
      return json;
}