import { html2md } from '@adobe/helix-html2md/src/html2md.js';
import { md2docx } from '@adobe/helix-md2docx'
import { writeFileSync } from 'node:fs';

const [url] = process.argv.slice(2);

const u = new URL(url)

const host = u.host;

fetch(url).then(resp => {
  return resp.text();
}).then(html => {
  return html2md(html, {log: {info: console.log}, url, mediaHandler: null});
}).then(md => {
    let newMd = md
    md.match(/\.\/media\_[a-zA-Z\=\?\d\&\.]*/gm).forEach(mediaLink => {
      newMd = newMd.replace(mediaLink, `${host}${mediaLink.slice(1)}`);
    });
    console.info(newMd);
    return md2docx(newMd, {});
}).then(docx => {
  writeFileSync('output.docx', docx);
});

