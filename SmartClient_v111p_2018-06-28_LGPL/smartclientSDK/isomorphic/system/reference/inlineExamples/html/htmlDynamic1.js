currentUser = "Secret Agent X";

isc.Label.create({
    wrap:false,
    icon:"icons/16/person.png",
    contents:"Logged in as: ${currentUser}",
    dynamicContents:true
})

isc.HTMLFlow.create({
    top:100,
    contents:"<hr>Today's date is <b>${new Date().toUSShortDate()}</b><hr>",
    dynamicContents:true
})
