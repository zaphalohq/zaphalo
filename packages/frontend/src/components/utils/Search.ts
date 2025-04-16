export const Search = ( searchArr  : any, searchChar : any) => {
    const searchedArr = searchArr.filter((channel: any) =>
        channel.channelName
          .toLowerCase()
          .startsWith(searchChar.toLowerCase() || "") // Search by first character
      );

      return searchedArr
}