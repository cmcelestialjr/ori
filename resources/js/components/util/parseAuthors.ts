export default function authors(authors: string) {
  return authors.split(",").flatMap((names) => {
    const fullNames = names.split(" ").filter((item) => item.length !== 2);

    const lnames = fullNames.pop();
    const fnames = fullNames.join(" ");

    return { first_name: fnames, last_name: lnames };
  });
}
