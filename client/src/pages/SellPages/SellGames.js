import React, { useState } from "react";

const SellGames = () => {
  const calculatePrice = (
    brand,
    brandType,
    condition,
    releaseYear,
    purchaseYear
  ) => {
    const prices = {
      playstation: {
        playstation3: { poorest: 20, moderate: 25, best: 30 },
        playstation4: { poorest: 40, moderate: 45, best: 50 },
        playstation5: { poorest: 50, moderate: 55, best: 60 },
      },
      xbox: {
        xbox360: { poorest: 20, moderate: 25, best: 30 },
        xboxOne: { poorest: 40, moderate: 45, best: 50 },
        xboxSeriesX: { poorest: 50, moderate: 55, best: 60 },
      },
      nintendo: {
        nintendoWii: { poorest: 30, moderate: 35, best: 40 },
        nintendoSwitch: { poorest: 50, moderate: 55, best: 60 },
        nintendo3DS: { poorest: 20, moderate: 25, best: 30 },
      },
      pc: { pc: { poorest: 10, moderate: 30, best: 50 } },
    };

    const basePrice = prices[brand][brandType][condition];
    const yearFactor = (new Date().getFullYear() - releaseYear) * 2;
    const purchaseYearFactor = (new Date().getFullYear() - purchaseYear) * 2;
    return basePrice - yearFactor + purchaseYearFactor;
  };

  const [brand, setBrand] = useState("");
  const [brandType, setBrandType] = useState("");
  const [condition, setCondition] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [price, setPrice] = useState("");
  const [showReleaseYear, setShowReleaseYear] = useState(false);
  const [purchaseYear, setPurchaseYear] = useState("");
  const [isGameBroken, setIsGameBroken] = useState(null);

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
      releaseYear,
      selectedPurchaseYear
    );
    setPrice(calculatedPrice);
  };

  const handleVerification = (isBroken) => {
    setIsGameBroken(isBroken);
  };

  return (
    <div>
      <div className="w-[80%] bg-gray-500 rounded-full mt-[15px] mx-[80px] h-2.5 dark:bg-gray-700">
        <div className="bg-green-600 h-2.5 rounded-full w-[100%]"></div>
        <div>100 %</div>
      </div>
      <div className="font-bold text-4xl text-orange-500 ml-[380px] mt-[40px] mb-[60px]">
        What game do you want to sell ?
      </div>
      <div className="ml-[100px]">
        <div>Before submitting your games to us, please ensure that:</div>
        <ul className="list-disc ml-[25px] mb-[50px]">
          <li>All are fully functional</li>
          <li>
            The case and cover show no signs of mechanical shocks (bends,
            cracks, color spots)
          </li>
        </ul>
        <div className="mb-[40px]">
          <h3 className="font-semibold text-xl mb-[10px]">
            Is the game broken ?
          </h3>
          <button
            className="button-condition mr-[50px]"
            onClick={() => handleVerification(true)}
          >
            Yes
          </button>
          <button
            className="button-condition mr-[20px]"
            onClick={() => handleVerification(false)}
          >
            No
          </button>
        </div>
        {isGameBroken ? (
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
              <button
                className="button-condition mr-[20px]"
                onClick={() => handleBrandChange("pc")}
              >
                PC
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
            {brand === "pc" && (
              <div className="mb-[30px]">
                <h3 className="font-semibold text-xl mb-[10px]">
                  Select Brand Type:
                </h3>
                <button
                  className="button-condition mr-[20px]"
                  onClick={() => handleBrandTypeChange("pc")}
                >
                  PC
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
            {brand && brandType && condition && (
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

export default SellGames;
