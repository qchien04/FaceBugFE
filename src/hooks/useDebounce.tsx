import { useState, useEffect } from "react";

function useDebounce(value:string, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;


//use
// import React, { useState } from "react";
// import useDebounce from "./useDebounce";

// function SearchComponent() {
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 500);

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Nhập từ khóa tìm kiếm..."
//       />
//       <p>Kết quả tìm kiếm cho: {debouncedQuery}</p>
//     </div>
//   );
// }

// export default SearchComponent;
