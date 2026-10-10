export function SearchBox({ defaultValue = "", large = false }: { defaultValue?: string; large?: boolean }) {
  return (
    <form action="/search" role="search" className={large ? "flex w-full" : "flex"}>
      <label htmlFor={large ? "q-large" : "q"} className="sr-only">
        Search songs, artists, annotations
      </label>
      <input
        id={large ? "q-large" : "q"}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={large ? "Search artists, songs, or a word from the bar" : "Search"}
        className={
          large
            ? "w-full border-2 border-ink bg-paper px-4 py-3 text-lg placeholder:text-mute"
            : "w-36 border-2 border-ink bg-paper px-2 py-1.5 text-sm placeholder:text-mute focus:w-52 sm:w-44"
        }
      />
      {large && (
        <button type="submit" className="bg-ink px-5 font-semibold text-paper hover:bg-stain-deep">
          Search
        </button>
      )}
    </form>
  );
}
