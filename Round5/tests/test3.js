function addTenStupid(num) {
    for(i=0; i < 10; i++) { num += 1; }
    return num;
  }
  
  function addThousandStupid(num) {
    for(i=0; i < 100; i++) { num += addTenStupid(0); }
    return num;
  }
  console.log(addTenStupid(0));
  console.log('Eka tuli');
  console.log(addTenStupid(5));
  console.log('Toka tuli');
  console.log(addThousandStupid(1));
  console.log('Kolmas tuli');