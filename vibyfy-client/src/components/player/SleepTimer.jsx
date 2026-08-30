import usePlayerStore from "../../store/playerStore";

const SleepTimer = () => {

  const {
    setSleepTimer,
    clearSleepTimer,
    sleepRemaining,
  } = usePlayerStore();

  const options = [15, 30, 45, 60, 120];

  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        ⏰ Sleep Timer
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {options.map((time) => (

          <button
            key={time}
            onClick={() => setSleepTimer(time)}
            className="bg-purple-600 rounded-xl py-3 hover:bg-purple-700"
          >
            {time} Minutes
          </button>

        ))}

      </div>

      <button
        onClick={clearSleepTimer}
        className="w-full mt-6 bg-red-600 rounded-xl py-3"
      >
        Cancel Timer
      </button>

      {sleepRemaining > 0 && (

        <p className="text-center mt-6 text-purple-400">

          Timer:
          {" "}
          {Math.floor(sleepRemaining / 60)}
          :
          {(sleepRemaining % 60)
            .toString()
            .padStart(2, "0")}

        </p>

      )}

    </div>
  );

};

export default SleepTimer;