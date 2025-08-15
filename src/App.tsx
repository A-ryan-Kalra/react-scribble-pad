import SkribblePad from "../components/skribble-pad";

function App() {
  return (
    <div>
      <div
        style={{ height: "100vh", width: "100%", backgroundColor: "black" }}
      ></div>

      <div
        style={{ height: "100vh", width: "100%", backgroundColor: "blue" }}
      ></div>
      <SkribblePad />
    </div>
  );
}

export default App;
