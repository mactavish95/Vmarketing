// Utility to format Instagram content for display (preview, history, full post)
// - Extracts hashtags
// - Formats bullet points
// - Preserves line breaks and visual structure

function formatInstagramContent(content) {
  if (!content) return '';
  // Split content into main content and hashtags
  const lines = content.split('\n');
  const hashtagLines = [];
  const mainContent = [];

  lines.forEach(line => {
    if (line.trim().startsWith('#')) {
      hashtagLines.push(line.trim());
    } else {
      mainContent.push(line);
    }
  });

  const mainText = mainContent.join('\n');
  const hashtags = hashtagLines.join(' ');

  // Format bullet points: wrap lines starting with '•' in a div
  let formattedContent = mainText
    .replace(/^•\s*/gm, '<div class="bullet-item"><span class="bullet-icon">•</span>')
    .replace(/\n/g, '</div>\n<div class="bullet-item"><span class="bullet-icon">•</span>');

  // Remove empty bullet wrappers
  formattedContent = formattedContent.replace(/<div class="bullet-item"><span class="bullet-icon">•<\/span><\/div>/g, '');

  // Add hashtags section if present
  if (hashtags) {
    formattedContent += `<div class="hashtags">${hashtags}</div>`;
  }

  return formattedContent;
}

export default formatInstagramContent; 