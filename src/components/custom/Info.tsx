const Info = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 max-w-[80%] mx-auto mb-4">
      <div className="flex items-center justify-center mb-4">
        <img
          src="/logo.png"
          alt="Sketchify Me logo"
          width={40}
          height={40}
          className="rounded-md mr-2"
        />
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">
          Sketchify Me
        </h1>
      </div>
      <p className="text-center text-gray-600 mb-2 md:mb-3">
        All your data is saved locally in your browser.
      </p>
      <h3 className="text-lg text-center md:text-xl font-semibold text-gray-800 mb-3">
        Common commands you can use:
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <CommandItem command="Press 1" action="Draw" />
        <CommandItem command="Press 2" action="Text" />
        <CommandItem command="Press 3" action="Erase" />
        <CommandItem command="Press 4" action="Scroll" />
        <CommandItem command="Press 5" action="Cursor" />
        <CommandItem command="Ctrl + Z" action="Undo" />
        <CommandItem command="Ctrl + Y" action="Redo" />
        <CommandItem command="Ctrl + S" action="Save as Image" />
        <CommandItem command="Ctrl + Shift + X" action="Clear all" />
      </div>
      <p className="text-center text-gray-600">
        You can change the color and width of strokes from the palette given at
        the bottom.
      </p>
    </div>
  );
};

function CommandItem({ command, action }: { command: string; action: string }) {
  return (
    <div className="bg-gray-100 rounded p-2 text-sm">
      <span className="font-medium text-gray-700">{command}:</span>{" "}
      <span className="text-gray-600">{action}</span>
    </div>
  );
}

export default Info;
