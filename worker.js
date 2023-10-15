self.addEventListener('message', function(event) {
    console.time('JSON Parse');
    const jsonData = JSON.parse(event.data);
    console.timeEnd('JSON Parse');

    console.time('HTML Creation');
    const htmlString = createDetailsElement(null, jsonData);
    console.timeEnd('HTML Creation');
    
    self.postMessage(htmlString);
    
});

function createDetailsElement(key, value, indent = '') {
    let html = '';
    let summary = key ? `<strong>${key}:</strong>` : '';
    if(value === null) {
      html += `${indent}<details open><summary>${summary}</summary> null</details>\n`;
      return html;
    }
    if (typeof value === 'object') {
      html += `${indent}<details open><summary>${summary}</summary>\n`;
      if(Array.isArray(value)) {
        value.forEach((item, index) => {
          html += createDetailsElement(index, item, indent + '  ');
        });
      } else {
        html += `${indent}  <div>\n`;
        const entries = Object.entries(value);
        for (const [k, v] of entries) {
          html += createDetailsElement(k, v, indent + '    ');
        }
        html += `${indent}  </div>\n`;
      }
      html += `${indent}</details>\n`;
    } else {
      html += `${indent}<details open><summary>${summary}</summary> ${value}</details>\n`;
    }
    return html;
  }