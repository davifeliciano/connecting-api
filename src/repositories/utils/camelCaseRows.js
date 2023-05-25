function toCamelCase(snakeCaseObj) {
  // Converts object keys to camel case
  const snakeCaseEntries = Object.entries(snakeCaseObj).map(
    ([snakeCaseKey, value]) => {
      const camelCaseKey = snakeCaseKey.replace(/([-_]+\w)/g, ($1) =>
        $1.toUpperCase().replaceAll("-", "").replaceAll("_", "")
      );

      return [camelCaseKey, value];
    }
  );

  return Object.fromEntries(snakeCaseEntries);
}

export default function camelCaseRows(rows) {
  return rows.map((row) => toCamelCase(row));
}
