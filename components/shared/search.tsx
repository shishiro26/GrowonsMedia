import { Input } from "../ui/input";
import { redirect } from "next/navigation";

const Search = ({ fileName }: { fileName: string }) => {
  async function searchProducts(formData: FormData) {
    "use server";
    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
      redirect(`/search/${fileName}?query=${searchQuery}&page=1`);
    }
  }

  return (
    <form action={searchProducts}>
      <div>
        <Input name="searchQuery" placeholder="search" />
      </div>
    </form>
  );
};

export default Search;
