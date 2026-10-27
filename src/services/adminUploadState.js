// Publishing to Git does not make a new asset available on the CDN immediately.
// Retain its blob preview until this editor closes, but do not resend its bytes.
export function publishedUploads(uploads, committed) {
  const paths=new Set(committed.map(file=>file.path));
  return Object.fromEntries(Object.entries(uploads).map(([path,file])=>[path,paths.has(path)?{...file,pending:false}:file]));
}
