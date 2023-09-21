const R = 6371e3; // metres
const toRadians = Math.PI/180;

// For an explanation and source code: https://www.movable-type.co.uk/scripts/latlong.html
export const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const φ1 = latitude1 * toRadians; // φ, λ in radians
  const φ2 = latitude2 * toRadians;
  const Δφ = (latitude2 - latitude1) * toRadians;
  const Δλ = (longitude2 - longitude1) * toRadians;

  const sinΔφ = Math.sin(Δφ/2);
  const sinΔλ = Math.sin(Δλ/2);

  const a = Math.pow(sinΔφ, 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.pow(sinΔλ, 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // in metres
};

export const findClosestCity = (latitude, longitude, cities) => {
  let closestCity = null;
  let closestDistance = Infinity;

  cities.forEach((city) => {
    const d = calculateDistance(latitude, longitude, city.latitude, city.longitude);
    if (d < closestDistance) {
      closestDistance = d;
      closestCity = city;
    }
  });

  return closestCity;
};
