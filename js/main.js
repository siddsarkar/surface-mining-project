document.getElementById("calculate-btn").onclick = () => {
  let pTarget = document.getElementById("prod-target").valueAsNumber;
  let shiftsDur = document.getElementById("shift-dur").valueAsNumber;
  let shiftsDay = document.getElementById("shifts-day").valueAsNumber;
  let specificGravity = document.getElementById("sg").valueAsNumber;
  let swellingFactor = document.getElementById("sf").valueAsNumber;
  let moisture = document.getElementById("moisture").valueAsNumber;
  let volShovel = document.getElementById("vol-sh").valueAsNumber;
  let utilisation = document.getElementById("util").valueAsNumber;
  let mechAvailability = document.getElementById("mech-avail").valueAsNumber;
  let cycleTime = document.getElementById("ct").valueAsNumber;
  let truckCapacity = document.getElementById("cp").valueAsNumber;
  let truckVol = document.getElementById("vol-tr").valueAsNumber;
  let truckTransVel = document.getElementById("trans-vel").valueAsNumber;
  let truckOprEff = document.getElementById("oe").valueAsNumber;
  let truckTraffic = document.getElementById("tr-traffic").valueAsNumber;
  let truckTransDist = document.getElementById("trans-dist").valueAsNumber;
  let truckReturningVel = document.getElementById("re-vel").valueAsNumber;
  let truckDumpTime = document.getElementById("dump-time").valueAsNumber;
  let truckSamplingTime = document.getElementById("sampling-time")
    .valueAsNumber;
  let truckBedClnTime = document.getElementById("bed-cl-time").valueAsNumber;
  let truckManuvTime = document.getElementById("manu-time").valueAsNumber;
  let truckShiftChngTime = document.getElementById("shift-chng-time")
    .valueAsNumber;
  let otherTime = document.getElementById("other-time").valueAsNumber;

  let bucketFactor = document.querySelectorAll('input[name="bucket-factor"]');
  let realVolCapShovel;
  let bulkDensity;
  let realBucketCapacity;
  let numBucketPertruck;
  let overallEffi;
  let hourlyProd;
  let prodPerShift;
  let prodPerDay;
  let numShovelReq;
  let estVolTruck;
  let estBulkTon;
  let loadTime;
  let transTime;
  let retTime;
  let cycleTimeTruck;
  let numTripShift;
  let prodTruckShift;
  let prodTruckDay;
  let numTruckDay;
  let totalProdTruck;
  let matchFactor;
  let queueLength;
  let y, u;
  for (let i = 0; i < bucketFactor.length; i++) {
    if (bucketFactor[i].checked) {
      bucketFillFactor = bucketFactor[i].value;
    }
  }

  realVolCapShovel = volShovel * bucketFillFactor;
  console.log("realVolCapShovel:", realVolCapShovel);

  bulkDensity = specificGravity / swellingFactor;
  console.log("bulkDensity:", bulkDensity);

  realBucketCapacity = realVolCapShovel * bulkDensity;
  console.log("realBucketCapacity:", realBucketCapacity);

  numBucketPertruck = Math.floor(truckVol / realVolCapShovel); // is an integer

  overallEffi =
    (utilisation * mechAvailability * truckTraffic * truckOprEff) / 100000000;
  console.log("overallEffi:", overallEffi * 100);

  hourlyProd =
    (3600 * realBucketCapacity * overallEffi * bulkDensity) / cycleTime;
  console.log("hourlyProd:", hourlyProd);

  prodPerShift = hourlyProd * shiftsDur;
  console.log("prodPerShift:", prodPerShift);

  prodPerDay = prodPerShift * shiftsDay;
  console.log("prodPerDay:", prodPerDay);

  numShovelReq = pTarget / prodPerDay; // if less than n.2 then n else n+1
  // console.log("numShovelReq:", numShovelReq);

  if (numShovelReq.toString().split(".")[1]) {
    let str = numShovelReq.toString().split(".")[1];
    // console.log(str[0]);
    if (parseInt(str[0]) > 1) {
      console.log("numShovelReq:", Math.floor(numShovelReq) + 1);
      numShovelReq = Math.floor(numShovelReq) + 1;
    } else {
      console.log("numShovelReq:", Math.floor(numShovelReq));
      numShovelReq = Math.floor(numShovelReq);
    }
  } else {
    numShovelReq.toString().split(".")[0];
    console.log("numShovelReq:", numShovelReq);
  }

  let totalProdShovel = prodPerDay * numShovelReq;
  console.log("totalProdShovel:", totalProdShovel);

  estVolTruck = realVolCapShovel * numBucketPertruck;
  console.log("estVolTruck", estVolTruck);

  estBulkTon = estVolTruck * bulkDensity; // if estbulkton > truck capacity then estbulkton=truck capacity
  if (estBulkTon > truckCapacity) {
    console.log("estBulkTon", truckCapacity);
    numBucketPertruck = truckCapacity / (bulkDensity * realVolCapShovel); // then numbucketpertruck=truckcapacity/(bulkdensity*realvolcapofshovel)
  } else {
    console.log("estBulkTon", estBulkTon);
  }

  console.log("numBucketPertruck:", Math.floor(numBucketPertruck));

  loadTime = (numBucketPertruck * cycleTime) / 60;
  console.log("loadTime(min)", loadTime);

  transTime = (60 * truckTransDist) / truckTransVel;
  console.log("transTime(min)", transTime);

  retTime = (60 * truckTransDist) / truckReturningVel;
  console.log("retTime", retTime);

  cycleTimeTruck =
    loadTime +
    transTime +
    truckDumpTime +
    retTime +
    truckSamplingTime +
    truckBedClnTime +
    truckManuvTime;
  console.log("cycleTimeTruck", cycleTimeTruck);

  numTripShift = Math.floor(
    (60 * (shiftsDur - (truckShiftChngTime + 0.5))) / cycleTimeTruck
  );
  console.log("numTripShift", numTripShift);

  prodTruckShift = numTripShift * estBulkTon;
  console.log("prodTruckShift", prodTruckShift);

  prodTruckDay = prodTruckShift * shiftsDay;
  console.log("prodTruckDay", prodTruckDay);

  numTruckDay = Math.floor((prodPerDay * numShovelReq) / prodTruckDay);
  console.log("numTruckDay", numTruckDay);

  totalProdTruck = prodTruckDay * numTruckDay;
  console.log("totalProdTruck", totalProdTruck);

  matchFactor = (numTruckDay * loadTime) / (numShovelReq * cycleTimeTruck);
  console.log("matchFactor", matchFactor);

  y = 60 / cycleTimeTruck;
  u = 60 / loadTime;

  queueLength = (y * y) / (u * (u - y));
  console.log("queueLength", queueLength);
};
