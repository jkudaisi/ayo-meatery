// All items, descriptions and prices from ayomeatery.com/menus (fetched 2026-11-01).
const SPICE3={n:'Spice level',req:1,o:[['Mild',0],['Hot',0],['Extra hot',0]]};
const PROT_FA={n:'Protein',req:1,o:[['No protein',0],['Fish',15],['Assorted meat (tripe, cow skin, beef)',15]]};
const PROT_CB={n:'Protein',req:1,o:[['No protein',0],['Chicken',8],['Beef',12]]};
const SERVE=(a,b)=>({n:'Serving',req:1,base:1,o:[['Single serve',a],['Double serve',b]]});
const soup=(id,n,d)=>({id,cat:'Soups & Stews',n,d:d||'Protein not included.',p:12,g:[SPICE3,PROT_FA]});
const MENU=[
 {id:'puff',cat:'Appetizers',n:'Puff Puff (7 pcs)',d:'West African deep-fried dough. Crispy outside, soft inside.',p:5,img:'puffpuff',t:['Vegan']},
 {id:'buns',cat:'Appetizers',n:'Buns (7 pcs)',d:'Sweet, deep-fried Nigerian buns.',p:5},
 {id:'small',cat:'Appetizers',n:'Small-Chops',d:'Bite-sized party snacks: spring rolls, samosas, mini kebabs.',p:15,img:'smallchops'},
 {id:'chin',cat:'Appetizers',n:'Chin-Chin',d:'Crunchy fried dough with sugar and spices.',p:5},
 {id:'pie',cat:'Appetizers',n:'Meat Pie',d:'Flaky pastry filled with seasoned minced meat and vegetables.',p:5},
 {id:'kuli',cat:'Appetizers',n:'Kuli Kuli',d:'Ground peanut snack, fried for crunch.',p:5,t:['Peanuts']},
 {id:'donkwa',cat:'Appetizers',n:'Donkwa',d:'Millet or maize, spices and groundnuts, fried crunchy.',p:5,t:['Peanuts']},
 {id:'fyam',cat:'Appetizers',n:'Fried Yam and Sauce',d:'Crispy yam with a tomato, onion and pepper sauce.',p:15,g:[{n:'Spice level',req:1,o:[['Mild',0],['Hot',0]]}]},
 {id:'fishroll',cat:'Appetizers',n:'Fish Roll (3 pcs)',d:'',p:5},
 {id:'ewa',cat:'Meals',n:'Ewa Aganyin',d:'Mashed beans with spicy palm oil sauce.',img:'ewa',g:[SERVE(10,15),PROT_FA]},
 {id:'jollof',cat:'Meals',n:'Jollof Rice',d:'Rice cooked in tomato sauce, onions and spices.',img:'jollof',g:[SERVE(10,15),PROT_CB]},
 {id:'fried',cat:'Meals',n:'Fried Rice',d:'Stir-fried with vegetables and spices.',img:'friedrice',g:[SERVE(10,15),PROT_CB]},
 {id:'ofada',cat:'Meals',n:'Ofada Rice',d:'Aromatic indigenous Nigerian rice.',g:[SERVE(8,11),{n:'Stew',req:1,o:[['No stew',0],['Ayamase stew',12]]}]},
 {id:'white',cat:'Meals',n:'White Rice',d:'Fluffy long-grain rice.',g:[SERVE(6,8),PROT_CB]},
 {id:'asaro',cat:'Meals',n:'Asaro (Yam Porridge)',d:'Nigerian yam porridge.',g:[SERVE(15,20),PROT_FA]},
 {id:'eba',cat:'Sides & Grill',n:'Eba',d:'Cassava flour staple, served with soups and stews.',p:3},
 {id:'poundo',cat:'Sides & Grill',n:'Poundo Yam / Fufu',d:'Smooth, stretchy pounded yam.',p:3},
 {id:'amala',cat:'Sides & Grill',n:'Amala',d:'Yam, cassava or plantain flour staple.',p:3},
 {id:'moi',cat:'Sides & Grill',n:'Moi-Moi',d:'Steamed bean cake.',p:5,img:'moimoi'},
 {id:'plantain',cat:'Sides & Grill',n:'Plantain',d:'Fried sweet plantain.',p:3,img:'moimoi'},
 {id:'scroaker',cat:'Sides & Grill',n:'Stewed Croaker Fish (whole)',d:'In a tomato-based sauce with onions, peppers and spices.',p:25},
 {id:'sgoat',cat:'Sides & Grill',n:'Stewed Goat Meat',d:'In a tomato-based sauce with onions, peppers and spices.',p:15},
 {id:'stilapia',cat:'Sides & Grill',n:'Stewed Tilapia Fish',d:'In a tomato-based sauce with onions, peppers and spices.',p:15},
 {id:'assorted',cat:'Sides & Grill',n:'Assorted Meat',d:'In a tomato-based sauce with onions, peppers and spices.',p:15},
 {id:'kebab',cat:'Sides & Grill',n:'Beef Kebab',d:'Spice level of your choice.',p:15,img:'kebab',g:[{n:'Spice level',req:1,o:[['No spice',0],['Mild',0],['Hot',0]]}]},
 {id:'gfish',cat:'Sides & Grill',n:'Grilled Fish',d:'Comes with a side of white rice.',img:'grilledfish',g:[{n:'Fish',req:1,base:1,o:[['Tilapia',25],['Croaker',25]]}]},
 {id:'giz',cat:'Sides & Grill',n:'Giz-Dodo',d:'Plantains with peppered gizzard.',p:10},
 {id:'bps',cat:'Pepper Soup',n:'Beef Pepper Soup',d:'Comes with its own spice levels.',p:23,g:[SPICE3]},
 {id:'gps',cat:'Pepper Soup',n:'Goat Pepper Soup',d:'Comes with its own spice levels.',p:25,img:'peppersoup',g:[SPICE3]},
 {id:'tps',cat:'Pepper Soup',n:'Tilapia Pepper Soup',d:'Comes with its own spice levels.',p:25,g:[SPICE3]},
 {id:'cps',cat:'Pepper Soup',n:'Croaker Pepper Soup',d:'Comes with its own spice levels.',p:25,g:[SPICE3]},
 Object.assign(soup('egusi','Egusi Soup'),{img:'egusi'}),soup('veg','Vegetable Soup'),soup('ewedu','Ewedu & Gbegiri Soup'),soup('okra','Okra Soup'),
 soup('ogbono','Ogbono Soup'),soup('cassava','Cassava Leaves'),soup('potato','Potato Greens'),
 {id:'ayamase',cat:'Soups & Stews',n:'Ayamase Sauce',d:'Protein not included. Special requests welcome.',p:12,g:[SPICE3,{n:'Rice',req:1,o:[['No rice',0],['White rice (single serve)',6],['White rice (double serve)',8]]}]},
 {id:'redstew',cat:'Soups & Stews',n:'Red Stew',d:'',p:12,g:[SPICE3,PROT_CB]},
 {id:'banga',cat:'Soups & Stews',n:'Banga Soup (palm butter soup)',d:'Limited time. Palm fruit extract, meat, fish and spices.',p:12,g:[{n:'Spice level',req:1,o:[['No spice',0],['Mild',0],['Hot',0]]}],t:['Limited']},
];
const money=n=>'$'+(Math.round(n*100)/100).toFixed(2).replace(/\.00$/,'');
function priceLabel(it){const s=it.g&&it.g.find(g=>g.base);if(s){const v=[...new Set(s.o.map(o=>o[1]))];return v.map(money).join(' / ');}return money(it.p);}
