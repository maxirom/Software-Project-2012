//
//  mathgrammar.js
//
/*
  The author or authors of this code dedicate any and all 
  copyright interest in this code to the public domain.
*/


// a very ambiguous grammar for doing calculations

var grammar = new Grammar('expr');

grammar.expr = [OneOf([[Ref('expr'), Ref('oper'), Ref('expr2'),
                        Tag("out = rules.oper(rules.expr, rules.expr2)")],
                       [Ref('unary'), Ref('expr'),
                        Tag("out = rules.unary(rules.expr)")],
                       [Ref('test'), 
                        Tag("out = rules.test")],
                       [Ref('number'), Tag("out = rules.number")]
                       ])];

grammar.expr2 = [Ref('expr'), Tag("out = rules.expr")];

grammar.unary = [OneOf([['-', Tag("out = function(x){return -x}")]])];

grammar.oper = [OneOf([['+', Tag("out = function(x,y){return x+y}")],
                       ['-', Tag("out = function(x,y){return x-y}")],
                       ['*', Tag("out = function(x,y){return x*y}")]])];

grammar.number = [OneOf([[Ref('digit'), Tag("out = rules.digit")],
                         [Ref('number'), Ref('digit'), 
                          Tag("out = 10 * rules.number + rules.digit")]])];

grammar.digit = [OneOf([['0', Tag("out = 0")],
                        ['1', Tag("out = 1")],
                        ['2', Tag("out = 2")],
                        ['3', Tag("out = 3")],
                        ['4', Tag("out = 4")],
                        ['5', Tag("out = 5")],
                        ['6', Tag("out = 6")],
                        ['7', Tag("out = 7")],
                        ['8', Tag("out = 8")],
                        ['9', Tag("out = 9")]])];
                        
grammar.test = [OneOf([['test', Tag("out = 'hallo'")]])]

grammar.$check();


