navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  err => console.error(err)
);