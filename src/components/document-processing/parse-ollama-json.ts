export const parseOllamaJson = (content:string) => {
      // Ollama should return raw JSON.  Parse defensively.
      let json;
      try {
        json = JSON.parse(content);
      } catch (e) {
        // If there's stray text, grab the first JSON block
        const m = content.match(/({.*})/s);
        json = m ? JSON.parse(m[1]) : {};
      }
      return json;
}