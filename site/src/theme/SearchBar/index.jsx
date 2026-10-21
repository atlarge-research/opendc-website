// Copied from @easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar/index.jsx (0.55.3), to use the
// SearchBar of this site, which can include or leave out the OpenDC2 results.
import React from "react";
import "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGenerated";
import SearchBar from "./SearchBar";
import { DocsPreferredVersionContextProvider } from "@docusaurus/plugin-content-docs/client";
export default function SearchBarWrapper(props) {
    return (<DocsPreferredVersionContextProvider>
      <SearchBar {...props}/>
    </DocsPreferredVersionContextProvider>);
}
