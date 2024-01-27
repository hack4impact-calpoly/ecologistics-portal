type Props = {
  params: { name: string };
};

export default function Page({ params: { name } }: Props) {
  return (
    <>
      <div className=" flex flex-col flex-shrink justify-center items-center bg-red-600 font-bold w-auto ">
        <h1 className="text-white">HELLO</h1>
        <h6 className="text-xs text-white">my name is</h6>
        <div className="bg-white inline-block w-auto p-5 m-2 w-full border-4 rounded-md border-double shadow-l shadow-zinc-600">
          <h1> {name} </h1>
        </div>
      </div>
    </>
  );
}
