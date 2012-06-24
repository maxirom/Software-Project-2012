//
//  testgrammar.js
//
/*
  The author or authors of this code dedicate any and all 
  copyright interest in this code to the public domain.
*/


// a very ambiguous grammar for doing calculations

var grammar = new Grammar('utt');

grammar.utt = [OneOf([
                       [Ref('deictic'), Ref('ne'), Tag("out = rules.ne")],
                       [Ref('test'), Tag("out = rules.test")],
                       [Ref('beatles'), Tag("out = rules.beatles")],
                       ])];
                       
grammar.deictic = [Optional([OneOf([
    ['this', 'is'],
    ['these', 'are'],
    ['here', 'is'],
    ['here', 'are'],
    ['mark','this','as'],
    ['tag','this','as'],
    ['mark','these','as'],
    ['tag','these','as'],
])])];

grammar.ne = [OneOf([
    ['the','beatles',Tag("out = 'beatles'")],
    ['beatles',Tag("out = 'beatles'")],
    ['john','lennon', Tag("out = 'beatles'")],
    ['ringo','starr', Tag("out = 'beatles'")],
    ['paul','mccartney', Tag("out = 'beatles'")],
    ['george','harrison', Tag("out = 'beatles'")],
    ['barrack','obama', Tag("out = 'barrack obama'")]
])]
                 
grammar.test = [OneOf([['test', Tag("out = 'hallo'")], ['beatles', Tag("out = 'mango starr'")]])];

grammar.beatles = [OneOf([
    ['beatles',Tag("out = 'john lemon'")]
])];

grammar.$check();