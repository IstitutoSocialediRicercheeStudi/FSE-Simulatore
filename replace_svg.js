import fs from 'fs';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = `${dir}/${file}`;
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
      return;
    }

    if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  });

  return results;
}

const files = walk('./src');

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const replaced = content.replace(
    /https:\/\/fse\.regione\.sicilia\.it\/assets\/bootstrap-italia\/svg\/sprites\.svg/g,
    '/sprites.svg'
  );

  if (content === replaced) return;

  fs.writeFileSync(file, replaced);
  console.log(`Replaced in ${file}`);
});
