import React, { useState } from "react";

const SellConsoles = () => {
  const calculatePrice = (
    brand,
    brandType,
    condition,
    controllerCount,
    hasCharger,
    releaseYear,
    purchaseYear
  ) => {
    const prices = {
      playstation: {
        playstation3: { poorest: 80, moderate: 100, best: 120 },
        playstation4: { poorest: 120, moderate: 220, best: 320 },
        playstation5: { poorest: 380, moderate: 480, best: 580 },
      },
      xbox: {
        xbox360: { poorest: 80, moderate: 100, best: 120 },
        xboxOne: { poorest: 100, moderate: 200, best: 300 },
        xboxSeriesX: { poorest: 360, moderate: 460, best: 560 },
      },
      nintendo: {
        nintendoWii: { poorest: 60, moderate: 80, best: 120 },
        nintendoSwitch: { poorest: 120, moderate: 220, best: 320 },
        nintendo3DS: { poorest: 30, moderate: 40, best: 50 },
      },
    };

    const basePrice = prices[brand][brandType][condition];
    const controllerPrice =
      controllerCount > 1 ? (controllerCount - 1) * 40 : 0;
    const chargerPrice = hasCharger ? 0 : 20;
    const yearFactor = (new Date().getFullYear() - releaseYear) * 2;
    const purchaseYearFactor = (new Date().getFullYear() - purchaseYear) * 2;
    return (
      basePrice +
      purchaseYearFactor -
      yearFactor -
      chargerPrice +
      controllerPrice
    );
  };

  const [brand, setBrand] = useState("");
  const [brandType, setBrandType] = useState("");
  const [condition, setCondition] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [price, setPrice] = useState("");
  const [showReleaseYear, setShowReleaseYear] = useState(false);
  const [purchaseYear, setPurchaseYear] = useState("");
  const [isConsoleBroken, setIsConsoleBroken] = useState(null);
  const [isConsoleModded, setIsConsoleModded] = useState(null);
  const [hasCharger, setHasCharger] = useState(false);
  const [controllerCount, setControllerCount] = useState(1);

  const handleBrandChange = (selectedBrand) => {
    setBrand(selectedBrand);
    setShowReleaseYear(true);
    setPrice("");
  };

  const handleBrandTypeChange = (selectedBrandType) => {
    setBrandType(selectedBrandType);
    setShowReleaseYear(true);
    setPrice("");
  };

  const handleConditionChange = (selectedCondition) => {
    setCondition(selectedCondition);
    setShowReleaseYear(true);
    setPrice("");
  };

  const handleReleaseYearChange = (event) => {
    const selectedReleaseYear = parseInt(event.target.value);
    setReleaseYear(selectedReleaseYear);
  };

  const handlePurchaseYearChange = (event) => {
    const selectedPurchaseYear = parseInt(event.target.value);

    setPurchaseYear(selectedPurchaseYear);
    const calculatedPrice = calculatePrice(
      brand,
      brandType,
      condition,
      controllerCount,
      hasCharger,
      releaseYear,
      selectedPurchaseYear
    );
    setPrice(calculatedPrice);
  };

  const handleConsoleModding = (isModded) => {
    setIsConsoleModded(isModded);
    if (isModded) {
      setIsConsoleBroken(true);
    } else {
      setIsConsoleBroken(false);
    }
  };

  return (
    <div>
      <div className="w-[80%] bg-gray-500 rounded-full mt-[15px] mx-[80px] h-2.5 dark:bg-gray-700">
        <div className="bg-green-600 h-2.5 rounded-full w-[100%]"></div>
        <div>100 %</div>
      </div>
      <div className="font-bold text-4xl text-orange-500 ml-[380px] mt-[40px] mb-[60px]">
        What console do you want to sell ?
      </div>
      <div className="ml-[100px]">
        <div>Before submitting your consoles to us, please ensure that:</div>
        <ul className="list-disc ml-[25px] mb-[50px]">
          <li>All are fully functional</li>
          <li>
            The case and cover show no signs of mechanical shocks (bends,
            cracks, color spots)
          </li>
        </ul>
        <div className="mb-[40px]">
          <h3 className="font-semibold text-xl mb-[10px]">
            Is the console broken ?
          </h3>
          <button
            className="button-condition mr-[50px]"
            onClick={() => setIsConsoleBroken(true)}
          >
            Yes
          </button>
          <button
            className="button-condition mr-[20px]"
            onClick={() => setIsConsoleBroken(false)}
          >
            No
          </button>
        </div>
        <div className="mb-[40px]">
          <h3 className="font-semibold text-xl mb-[10px]">
            Is the console modded ?
          </h3>
          <button
            className="button-condition mr-[50px]"
            onClick={() => handleConsoleModding(true)}
          >
            Yes
          </button>
          <button
            className="button-condition mr-[20px]"
            onClick={() => handleConsoleModding(false)}
          >
            No
          </button>
        </div>
        {isConsoleBroken || isConsoleModded ? (
          <p className="p-[20px] bg-red-500 text-white my-[30px] mx-[100px] text-2xl">
            Can't sell this item !!!
          </p>
        ) : (
          <>
            <div className="mb-[40px]">
              <h3 className="font-semibold text-xl mb-[10px]">Select Brand:</h3>
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleBrandChange("playstation")}
              >
                PlayStation
              </button>
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleBrandChange("xbox")}
              >
                Xbox
              </button>
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleBrandChange("nintendo")}
              >
                Nintendo
              </button>
            </div>
            {brand === "playstation" && (
              <div className="mb-[30px]">
                <h3 className="font-semibold text-xl mb-[10px]">
                  Select Brand Type:
                </h3>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("playstation3")}
                >
                  PlayStation 3
                </button>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("playstation4")}
                >
                  PlayStation 4
                </button>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("playstation5")}
                >
                  PlayStation 5
                </button>
              </div>
            )}
            {brand === "xbox" && (
              <div className="mb-[30px]">
                <h3 className="font-semibold text-xl mb-[10px]">
                  Select Brand Type:
                </h3>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("xbox360")}
                >
                  Xbox 360
                </button>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("xboxOne")}
                >
                  Xbox One
                </button>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("xboxSeriesX")}
                >
                  Xbox Series X
                </button>
              </div>
            )}
            {brand === "nintendo" && (
              <div className="mb-[30px]">
                <h3 className="font-semibold text-xl mb-[10px]">
                  Select Brand Type:
                </h3>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("nintendoWii")}
                >
                  Nintendo Wii
                </button>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("nintendoSwitch")}
                >
                  Nintendo Switch
                </button>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("nintendo3DS")}
                >
                  Nintendo 3DS
                </button>
              </div>
            )}
            <div className="mb-[30px]">
              <h3 className="font-semibold text-xl mb-[10px]">
                Select Condition:
              </h3>
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleConditionChange("poorest")}
              >
                Poorest
              </button>
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleConditionChange("moderate")}
              >
                Moderate
              </button>
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleConditionChange("expensive")}
              >
                Best
              </button>
            </div>
            <div className="mb-[40px]">
              <h3 className="font-semibold text-xl mb-[10px]">
                How many controllers does the console come with?
              </h3>
              <button
                className={`button-condition mr-[20px] ${
                  controllerCount === 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setControllerCount(1)}
              >
                1
              </button>
              <button
                className={`button-condition mr-[20px] ${
                  controllerCount === 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setControllerCount(2)}
              >
                2
              </button>
              <button
                className={`button-condition mr-[20px] ${
                  controllerCount === 3
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setControllerCount(3)}
              >
                3
              </button>
            </div>

            <div className="mb-[40px]">
              <h3 className="font-semibold text-xl mb-[10px]">
                Does the console have a charger?
              </h3>
              <button
                className={`button-condition mr-[20px] ${
                  hasCharger ? "bg-green-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => setHasCharger(true)}
              >
                Yes
              </button>
              <button
                className={`button-condition mr-[20px] ${
                  !hasCharger ? "bg-red-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => setHasCharger(false)}
              >
                No
              </button>
            </div>
            {brand && brandType && condition && showReleaseYear && (
              <div className="mb-[30px]">
                <h3 className="font-semibold text-xl mb-[10px]">
                  Release Year:
                </h3>
                <input
                  type="number"
                  id="releaseYear"
                  value={releaseYear}
                  onChange={handleReleaseYearChange}
                  min="2000"
                  className="w-20 md:w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
                  max={new Date().getFullYear()}
                />
              </div>
            )}
            {brand && brandType && condition && showReleaseYear && (
              <div className="mb-[30px]">
                <h3 className="font-semibold text-xl mb-[10px]">
                  Purchase Year:
                </h3>
                <input
                  type="number"
                  id="purchaseYear"
                  value={purchaseYear}
                  onChange={handlePurchaseYearChange}
                  min={releaseYear}
                  className="w-20 md:w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
                  max={new Date().getFullYear()}
                />
              </div>
            )}
            <div className="mb-[40px] text-4xl ml-[500px]">
              {price !== "" && <p className="font-semibold">Price: ${price}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellConsoles;
