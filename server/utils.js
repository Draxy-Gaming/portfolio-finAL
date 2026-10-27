export const generateSlug = (title, year) => {
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (year) {
    slug += `-${year}`;
  }
  return slug;
};
