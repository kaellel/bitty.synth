String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/**
 * This method adds the results of expression1 and expression2. If neither
 * expression is a numerical term, then each expression is first evaluated.
 * @param expression1 The first expression.
 * @param expression2 The second expression.
 * @return A double representing the sum of the results of both expressions.
 */
function Sum(expression1, expression2) {
    return EvaluateExpression(expression1) + EvaluateExpression(expression2);
}

/**
 * This method subtracts the results of expression1 and expression2. If neit
 * her expression is a numerical term, then each expression is first evaluat
 * ed.
 * @param expression1 The first expression.
 * @param expression2 The second expression.
 * @return A double representing the expression2 subtracted from expression1.
 */
function Difference(expression1, expression2) {
    return EvaluateExpression(expression1) - EvaluateExpression(expression2);
}

/**
 * This method multiplies the results of expression1 and expression2. If nei
 * ther expression is a numerical term, then each expression is first evalua
 * ted.
 * @param expression1 The first expression.
 * @param expression2 The second expression.
 * @return A double representing the product of both expressions.
 */
function Product(expression1, expression2) {
    return EvaluateExpression(expression1) * EvaluateExpression(expression2);
}

/**
 * This method either approximates a quotient or computes the quotient of ex
 * pression1 and expression2. If the denominator, expression2, is close to z
 * ero, i.e., less than 0.0001, then it is assumed to be zero. When the deno
 * minator is not zero, the method returns the quotient; when the denominato
 * r is zero, the method returns 100.
 * @param expression1 The first expression.
 * @param expression2 The second expression.
 * @return A double that either is the quotient of expression1 divided by ex
 * pression2, or a numerical approximation.
 */
function Quotient(expression1, expression2) {
    if (Math.abs(EvaluateExpression(expression2))<0.0001) return 127;
    return EvaluateExpression(expression1) / EvaluateExpression(expression2);
}

/**
 * This method returns the result of expression1 raised to the power of the
 * result of expression2. If neither expression is a numerical term, then ea
 * ch expression is first evaluated.
 * @param expression1 The first expression.
 * @param expression2 The second expression.
 * @return A double representing the exponent result.
 */
function Exponent(expression1, expression2) {
    return Math.pow(EvaluateExpression(expression1), EvaluateExpression(expression2));
}

/**
 * This method recursively evaluates an expression with numbers and operator
 * s.
 * @param expression
 * @return A double representing the result of the evaluation.
 */
function EvaluateExpression(expression) {
    try {
        // Remove Spaces from the Expression
        expression = expression.toUpperCase();
        expression = expression.replaceAll(" ", "");

        // First Check for Parentheses
        if (expression.indexOf("(")!= -1) {
            // Case One: Contains Parentheses

            // Find the Outermost parenthesis
            var pIndexStart;
            var pIndexEnd;
            pIndexStart = expression.lastIndexOf("(");

            for (pIndexEnd = pIndexStart; ; pIndexEnd++) {
                if (expression.substring(pIndexEnd, pIndexEnd + 1) === (")")) break;
            }

            // Evaluate the contents of the parenthesis
            var pExpression = expression.substring(pIndexStart + 1, pIndexEnd);
            var pExpressionResult = EvaluateExpression(pExpression);

            // Insert the evaluated result back into the expression
            var insertExpression = "" + pExpressionResult;
            if (pExpressionResult < 0) insertExpression = "_" + parseFloat(-1 * pExpressionResult);
            var newExpression = expression.substring(0, pIndexStart) + insertExpression + expression.substring(pIndexEnd + 1);

            // Finish evaluation by evaluating the new less complex string
            return EvaluateExpression(newExpression);
        } else {
            // Case Two: There are no more Parentheses

            if (expression.indexOf("+") != -1) {
                var Pos = expression.indexOf("+");
                var exp1 = expression.substring(0, Pos);
                var exp2 = expression.substring(Pos + 1);
                return Sum(exp1, exp2);
            } else if (expression.indexOf("-") != -1) {
                var Pos = expression.indexOf("-");
                var exp1 = expression.substring(0, Pos);
                var exp2 = expression.substring(Pos + 1);
                return Difference(exp1, exp2);
            } else if (expression.indexOf("*") != -1) {
                var Pos = expression.indexOf("*");
                var exp1 = expression.substring(0, Pos);
                var exp2 = expression.substring(Pos + 1);
                return Product(exp1, exp2);
            } else if (expression.indexOf("/") != -1) {
                var Pos = expression.indexOf("/");
                var exp1 = expression.substring(0, Pos);
                var exp2 = expression.substring(Pos + 1);
                return Quotient(exp1, exp2);
            } else if (expression.indexOf("^") != -1) {
                var Pos = expression.indexOf("^");
                var exp1 = expression.substring(0, Pos);
                var exp2 = expression.substring(Pos + 1);
                return Exponent(exp1, exp2);
            } else {
                // When there are no more operators to evaluate, simply return the number or Trig function result.
                if (expression === ("")) return 0;
                if (expression.length > 2) {
                    if (expression.substring(0, 3)===("SIN")) return Math.sin(EvaluateExpression(expression.substring(3)));
                    if (expression.substring(0, 3)===("COS")) return Math.cos(EvaluateExpression(expression.substring(3)));
                    if (expression.substring(0, 3)===("TAN")) return Math.tan(EvaluateExpression(expression.substring(3)));
                    if (expression.substring(0, 3)===("ABS")) return Math.abs(EvaluateExpression(expression.substring(3)));
                    if (expression.substring(0, 3)===("SIN")) return Math.sin(EvaluateExpression(expression.substring(3)));
                }
                if (expression.length > 3) {
                    if (expression.substring(0, 4)===("SQRT")) return Math.sqrt(EvaluateExpression(expression.substring(4)));
                }
                if (expression.length > 5) {
                    if (expression.substring(0, 6)===("ARCSIN")) return Math.asin(EvaluateExpression(expression.substring(6)));
                    if (expression.substring(0, 6)===("ARCCOS")) return Math.acos(EvaluateExpression(expression.substring(6)));
                    if (expression.substring(0, 6)===("ARCTAN")) return Math.atan(EvaluateExpression(expression.substring(6)));
                }
                if (expression.length >= 2 && expression.substring(0, 1)===("_")) return -1 * parseFloat(expression.substring(1));
                if (expression.length >= 3 && expression.substring(0, 2)===("__")) return parseFloat(expression.substring(2));
                return parseFloat(expression);
            }
        }
    } catch (e) {
        return 0.001;
    }

}
