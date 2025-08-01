export const Search = ( searchArr  : any, searchChar : any) => {
    const searchedArr = searchArr.filter((channel: any) =>
        channel.channelName
          .toLowerCase()
          .startsWith(searchChar.toLowerCase() || "")
      );

      return searchedArr
}