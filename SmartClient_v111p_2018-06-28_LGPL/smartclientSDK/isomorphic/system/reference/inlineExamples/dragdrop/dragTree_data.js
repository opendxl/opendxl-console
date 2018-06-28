isc.Tree.create({ID:"partsTree1", root:{children:[
    {name:"Bin 1", children:[
        {name:"Blue Cube", icon:"cube_blue.png"},
        {name:"Yellow Cube", icon:"cube_yellow.png"},
        {name:"Green Cube", icon:"cube_green.png"}
    ]},
    {name:"Bin 2", children:[
        {name:"Blue Piece", icon:"pawn_blue.png"},
        {name:"Yellow Piece", icon:"pawn_yellow.png"},
        {name:"Green Piece", icon:"pawn_green.png"}
    ]}
]}})

isc.Tree.create({ID:"partsTree2", root:{children:[
    {name:"Bin 3", children:[
        {name:"Blue Part", icon:"piece_blue.png"},
        {name:"Green Part", icon:"piece_green.png"},
        {name:"Yellow Part", icon:"piece_yellow.png"}
    ]}
]}})

partsTree1.openAll();
partsTree2.openAll();
