
const ChatsHero = () => {

  return (
    <div className="relative h-[76vh] overflow-y-scroll">
    {/* opacity of image */}
    <div className="absolute inset-0 bg-whatsappImg bg-gray-500 opacity-15 z-0"></div>

    <div className="relative z-10 p-4">
      <div className= "text-stone-900 flex justify-start text-lg ">
        <div className="bg-[#ffffff] p-2 rounded">this is elon musk</div>
      </div>
      <div className="flex justify-end rounded text-lg">
        <div className="p-2 text-stone-900 bg-[#dbf8c6] rounded">this is me</div>
      </div>
    </div>
  </div>
  )
}

export default ChatsHero
