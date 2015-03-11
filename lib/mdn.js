/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2015, Nicolas Riesco
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * Documentation for Javascript builtins adapted by Nicolas Riesco from the
 * Mozilla Developer Network (MDN)
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects}.
 *
 * @see Please, refer to the URLs within for attribution and licensing terms.
 */
module.exports = {
    "Array": {
        "description": "The JavaScript Array global object is a constructor for arrays, which are high-level, list-like objects.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", 
        "usage": "[element0, element1, ..., elementN]\nnew Array(element0, element1[, ...[, elementN]])\nnew Array(arrayLength)"
    }, 
    "Array.from": {
        "description": "The Array.from() method creates a new Array instance from an array-like or iterable object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from", 
        "usage": "Array.from(arrayLike[, mapFn[, thisArg]])\n\nParameters\n  arrayLike\n    An array-like or iterable object to convert to an array.\n  mapFn\n    Optional. Map function to call on every element of the array.\n  thisArg\n    Optional. Value to use as this when executing mapFn."
    }, 
    "Array.isArray": {
        "description": "The Array.isArray() method returns true if an object is an array, false if it is not.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray", 
        "usage": "Array.isArray(obj)\nParameters\n  obj\n    The object to be checked."
    }, 
    "Array.length": {
        "description": "The length property represents an unsigned, 32-bit integer that specifies the number of elements in an array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length"
    }, 
    "Array.observe": {
        "description": "The Array.observe() method is used for asynchronously observing changes to Arrays, similar to Object.observe() for objects. It provides a stream of changes in order of occurrence.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe", 
        "usage": "Array.observe(arr, callback)\nParameters\n  arr\n    The array to be observed.\n  callback\n    The function called each time changes are made, with the following\n    argument:     changes      An array of objects each representing a\n    change. The properties of these change objects are:      name: The\n    name of the property which was changed. object: The changed array\n    after the change was made. type: A string indicating the type of\n    change taking place. One of \"add\", \"update\", \"delete\", or\n    \"splice\". oldValue: Only for \"update\" and \"delete\" types. The\n    value before the change. index: Only for the \"splice\" type. The\n    index at which the change occurred. removed: Only for the \"splice\"\n    type. An array of the removed elements. addedCount: Only for the\n    \"splice\" type. The number of elements added."
    }, 
    "Array.of": {
        "description": "The Array.of() method creates a new Array instance with a variable number of arguments, regardless of number or type of the arguments.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of", 
        "usage": "Array.of(element0[, element1[, ...[, elementN]]])\nParameters\n  elementN\n    Elements of which to create the array."
    }, 
    "Array.prototype": {
        "description": "The Array.prototype property represents the prototype for the Array constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype"
    }, 
    "Array.prototype.concat": {
        "description": "The concat() method returns a new array comprised of the array on which it is called joined with the array(s) and/or value(s) provided as arguments.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat", 
        "usage": "var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])\nParameters\n  valueN\n    Arrays and/or values to concatenate into a new array. See the\n    discussion below for details."
    }, 
    "Array.prototype.copyWithin": {
        "description": "The copyWithin() method copies the sequence of array elements within the array to the position starting at target. The copy is taken from the index positions of the second and third arguments start and end. The end argument is optional and defaults to the length of the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin", 
        "usage": "arr.copyWithin(target, start[, end = this.length])\nParameters\n  target\n    Target start index position where to copy the elements to.\n  start\n    Source start index position where to start copying elements from.\n  end\n    Optional. Source end index position where to end copying elements\n    from."
    }, 
    "Array.prototype.entries": {
        "description": "The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries", 
        "usage": "arr.entries()"
    }, 
    "Array.prototype.every": {
        "description": "The every() method tests whether all elements in the array pass the test implemented by the provided function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every", 
        "usage": "arr.every(callback[, thisArg])\nParameters\n  callback\n    Function to test for each element, taking three arguments:\n    currentValue      The current element being processed in the\n    array.  index      The index of the current element being\n    processed in the array.  array      The array every was called\n    upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "Array.prototype.fill": {
        "description": "The fill() method fills all the elements of an array from a start index to an end index with a static value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill", 
        "usage": "arr.fill(value[, start = 0[, end = this.length]])\nParameters\n  value\n    Value to fill an array.\n  start\n    Optional. Start index.\n  end\n    Optional. End index."
    }, 
    "Array.prototype.filter": {
        "description": "The filter() method creates a new array with all elements that pass the test implemented by the provided function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter", 
        "usage": "arr.filter(callback[, thisArg])\nParameters\n  callback\n    Function to test each element of the array. Invoked with arguments\n    (element, index, array). Return true to keep the element, false\n    otherwise.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "Array.prototype.find": {
        "description": "The find() method returns a value in the array, if an element in the array satisfies the provided testing function. Otherwise undefined is returned.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find", 
        "usage": "arr.find(callback[, thisArg])\nParameters\n  callback\n    Function to execute on each value in the array, taking three\n    arguments:     element      The current element being processed in\n    the array.  index      The index of the current element being\n    processed in the array.  array      The array find was called\n    upon.\n  thisArg\n    Optional. Object to use as this when executing callback."
    }, 
    "Array.prototype.findIndex": {
        "description": "The findIndex() method returns an index in the array, if an element in the array satisfies the provided testing function. Otherwise -1 is returned.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex", 
        "usage": "arr.findIndex(callback[, thisArg])\nParameters\n  callback\n    Function to execute on each value in the array, taking three\n    arguments:   element The current element being processed in the\n    array. index The index of the current element being processed in\n    the array. array The array findIndex was called upon.\n  thisArg\n    Optional. Object to use as this when executing callback."
    }, 
    "Array.prototype.forEach": {
        "description": "The forEach() method executes a provided function once per array element.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach", 
        "usage": "arr.forEach(callback[, thisArg])\nParameters\n  callback\n    Function that produces an element of the new Array, taking three\n    arguments:   currentValue The current element being processed in\n    the array. index The index of the current element being processed\n    in the array. array The array forEach() was called upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "Array.prototype.includes": {
        "description": "The includes() method determines whether an array includes a certain element, returning true or false as appropriate.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes", 
        "usage": "array.includes(searchElement[, fromIndex])\nParameters\n  searchElement\n    The element to search for.\n  fromIndex\n    Optional. The position in this array at which to begin searching\n    for searchElement; defaults to 0."
    }, 
    "Array.prototype.indexOf": {
        "description": "The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf", 
        "usage": "arr.indexOf(searchElement[, fromIndex = 0])\nParameters\n  searchElement\n    Element to locate in the array.\n  fromIndex\n    The index to start the search at. If the index is greater than or\n    equal to the array's length, -1 is returned, which means the array\n    will not be searched. If the provided index value is a negative\n    number, it is taken as the offset from the end of the array. Note:\n    if the provided index is negative, the array is still searched\n    from front to back. If the calculated index is less than 0, then\n    the whole array will be searched. Default: 0 (entire array is\n    searched)."
    }, 
    "Array.prototype.join": {
        "description": "The join() method joins all elements of an array into a string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join", 
        "usage": "str = arr.join([separator = ','])\nParameters\n  separator\n    Optional. Specifies a string to separate each element of the\n    array. The separator is converted to a string if necessary. If\n    omitted, the array elements are separated with a comma. If\n    separator is an empty string all elements are joined without any\n    characters in between them."
    }, 
    "Array.prototype.keys": {
        "description": "The keys() method returns a new Array Iterator that contains the keys for each index in the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys", 
        "usage": "arr.keys()"
    }, 
    "Array.prototype.lastIndexOf": {
        "description": "The lastIndexOf() method returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf", 
        "usage": "arr.lastIndexOf(searchElement[, fromIndex = arr.length])"
    }, 
    "Array.prototype.map": {
        "description": "The map() method creates a new array with the results of calling a provided function on every element in this array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map", 
        "usage": "arr.map(callback[, thisArg])\nParameters\n  callback\n    Function that produces an element of the new Array, taking three\n    arguments:     currentValue      The current element being\n    processed in the array.  index      The index of the current\n    element being processed in the array.  array      The array map\n    was called upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "Array.prototype.pop": {
        "description": "The pop() method removes the last element from an array and returns that element.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop", 
        "usage": "arr.pop()"
    }, 
    "Array.prototype.push": {
        "description": "The push() method adds one or more elements to the end of an array and returns the new length of the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", 
        "usage": "arr.push(element1, ..., elementN)\nParameters\n  elementN\n    The elements to add to the end of the array.\nReturns\nThe new length property of the object upon which the method was called."
    }, 
    "Array.prototype.reduce": {
        "description": "The reduce() method applies a function against an accumulator and each value of the array (from left-to-right) has to reduce it to a single value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce", 
        "usage": "arr.reduce(callback[, initialValue])\nParameters\n  callback\n    Function to execute on each value in the array, taking four\n    arguments:   previousValue The value previously returned in the\n    last invocation of the callback, or initialValue, if supplied.\n    (See below.) currentValue The current element being processed in\n    the array. index The index of the current element being processed\n    in the array. array The array reduce was called upon.\n  initialValue\n    Optional. Object to use as the first argument to the first call of\n    the callback."
    }, 
    "Array.prototype.reduceRight": {
        "description": "The reduceRight() method applies a function against an accumulator and each value of the array (from right-to-left) has to reduce it to a single value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight", 
        "usage": "arr.reduceRight(callback[, initialValue])\nParameters\n  callback\n    Function to execute on each value in the array, taking four\n    arguments:   previousValue The value previously returned in the\n    last invocation of the callback, or initialValue, if supplied.\n    (See below.) currentValue The current element being processed in\n    the array. index The index of the current element being processed\n    in the array. array The array reduce was called upon.\n  initialValue\n    Optional. Object to use as the first argument to the first call of\n    the callback."
    }, 
    "Array.prototype.reverse": {
        "description": "The reverse() method reverses an array in place. The first array element becomes the last and the last becomes the first.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse", 
        "usage": "arr.reverse()"
    }, 
    "Array.prototype.shift": {
        "description": "The shift() method removes the first element from an array and returns that element. This method changes the length of the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift", 
        "usage": "arr.shift()"
    }, 
    "Array.prototype.slice": {
        "description": "The slice() method returns a shallow copy of a portion of an array into a new array object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice", 
        "usage": "arr.slice([begin[, end]])"
    }, 
    "Array.prototype.some": {
        "description": "The some() method tests whether some element in the array passes the test implemented by the provided function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some", 
        "usage": "arr.some(callback[, thisArg])\nParameters\n  callback\n    Function to test for each element, taking three arguments:\n    currentValue The current element being processed in the array.\n    index The index of the current element being processed in the\n    array. array The array some() was called upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "Array.prototype.sort": {
        "description": "The sort() method sorts the elements of an array in place and returns the array. The sort is not necessarily stable. The default sort order is according to string Unicode code points.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort", 
        "usage": "arr.sort([compareFunction])\nParameters\n  compareFunction\n    Optional. Specifies a function that defines the sort order. If\n    omitted, the array is sorted according to each character's Unicode\n    code point value, according to the string conversion of each\n    element."
    }, 
    "Array.prototype.splice": {
        "description": "The splice() method changes the content of an array by removing existing elements and/or adding new elements.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice", 
        "usage": "array.splice(start, deleteCount[, item1[, item2[, ...]]])\n\nParameters\n  start\n    Index at which to start changing the array. If greater than the\n    length of the array, actual starting index will be set to the\n    length of the array. If negative, will begin that many elements\n    from the end.\n  deleteCount\n    An integer indicating the number of old array elements to remove.\n    If deleteCount is 0, no elements are removed. In this case, you\n    should specify at least one new element. If deleteCount is greater\n    than the number of elements left in the array starting at start,\n    then all of the elements through the end of the array will be\n    deleted.\n  itemN\n    The element to add to the array. If you don't specify any\n    elements, splice() will only remove elements from the array.\nReturns\nAn array containing the deleted elements. If only one element is removed, an array of one element is returned. If no elements are removed, an empty array is returned."
    }, 
    "Array.prototype.toLocaleString": {
        "description": "The toLocaleString() method returns a string representing the elements of the array. The elements are converted to Strings using their toLocaleString methods and these Strings are separated by a locale-specific String (such as a comma).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString", 
        "usage": "arr.toLocaleString();"
    }, 
    "Array.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSource", 
        "usage": "arr.toSource()"
    }, 
    "Array.prototype.toString": {
        "description": "The toString() method returns a string representing the specified array and its elements.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString", 
        "usage": "arr.toString()"
    }, 
    "Array.prototype.unshift": {
        "description": "The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift", 
        "usage": "arr.unshift([element1[, ...[, elementN]]])\nParameters\n  elementN\n    The elements to add to the front of the array.\nReturns\nThe new length property of the object upon which the method was called."
    }, 
    "Array.prototype.values": {
        "description": "The values() method returns a new Array Iterator object that contains the values for each index in the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values", 
        "usage": "arr.values()"
    }, 
    "Array.prototype[@@iterator]": {
        "description": "The initial value of the @@iterator property is the same function object as the initial value of the values() property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator", 
        "usage": "arr[Symbol.iterator]()"
    }, 
    "ArrayBuffer": {
        "description": "The ArrayBuffer object is used to represent a generic, fixed-length raw binary data buffer. You can not directly manipulate the contents of an ArrayBuffer; instead, you create one of the typed array objects or a DataView object which represents the buffer in a specific format, and use that to read and write the contents of the buffer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer", 
        "usage": "new ArrayBuffer(length)\n\nParameters\n  length\n    The size, in bytes, of the array buffer to create.\nReturns\nA new ArrayBuffer object of the specified size. Its contents are initialized to 0."
    }, 
    "ArrayBuffer.isView": {
        "description": "The ArrayBuffer.isView() method returns true if arg is a view one of the ArrayBuffer views, such as typed array objects or a DataView; false otherwise.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView", 
        "usage": "ArrayBuffer.isView(arg)\nParameters\n  arg\n    The argument to be checked."
    }, 
    "ArrayBuffer.prototype": {
        "description": "The ArrayBuffer.prototype property represents the prototype for the ArrayBuffer object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/prototype"
    }, 
    "ArrayBuffer.prototype.byteLength": {
        "description": "The byteLength accessor property represents the length of an ArrayBuffer in bytes.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/byteLength"
    }, 
    "ArrayBuffer.prototype.slice": {
        "description": "The slice() method returns a new ArrayBuffer whose contents are a copy of this ArrayBuffer's bytes from begin, inclusive, up to end, exclusive.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/slice", 
        "usage": "arraybuffer.slice(begin[, end])\nParameters\n  begin\n    Zero-based byte index at which to begin slicing.\nReturns\nA new ArrayBuffer object."
    }, 
    "ArrayBuffer.transfer": {
        "description": "The static ArrayBuffer.transfer() method returns a new ArrayBuffer whose contents are taken from the oldBuffer's data and then is either truncated or zero-extended by newByteLength. If newByteLength is undefined, the byteLength of the oldBuffer is used. This operation leaves oldBuffer in a detached state.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer", 
        "usage": "ArrayBuffer.transfer(oldBuffer [, newByteLength]);\nParameters\n  oldBuffer\n    An ArrayBuffer object from which to transfer from.\n  newByteLength\n    The byte length of the new ArrayBuffer object."
    }, 
    "Boolean": {
        "description": "The Boolean object is an object wrapper for a boolean value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean", 
        "usage": "new Boolean([value])\nParameters\n  value\n    Optional. The initial value of the Boolean object."
    }, 
    "Boolean.prototype": {
        "description": "The Boolean.prototype property represents the prototype for the Boolean constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/prototype"
    }, 
    "Boolean.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/toSource", 
        "usage": "booleanObj.toSource()\nBoolean.toSource()"
    }, 
    "Boolean.prototype.toString": {
        "description": "The toString() method returns a string representing the specified Boolean object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/toString", 
        "usage": "bool.toString()"
    }, 
    "Boolean.prototype.valueOf": {
        "description": "The valueOf() method returns the primitive value of a Boolean object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/valueOf", 
        "usage": "bool.valueOf()"
    }, 
    "DataView": {
        "description": "The DataView view provides a low-level interface for reading data from and writing it to an ArrayBuffer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView", 
        "usage": "new DataView(buffer [, byteOffset [, byteLength]])\nParameters\n  buffer\n    An existing ArrayBuffer to use as the storage for the new DataView\n    object.\n  byteOffset Optional\n    The offset, in bytes, to the first byte in the specified buffer\n    for the new view to reference. If not specified, the view of the\n    buffer will start with the first byte.\n  byteLength Optional\n    The number of elements in the byte array. If unspecified, length\n    of the view will match the buffer's length.\nReturns\nA new DataView object representing the specified data buffer."
    }, 
    "DataView.prototype": {
        "description": "The DataView.prototype property represents the prototype for the DataView object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/prototype"
    }, 
    "DataView.prototype.buffer": {
        "description": "The buffer accessor property represents the ArrayBuffer referenced by the DataView at construction time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/buffer"
    }, 
    "DataView.prototype.byteLength": {
        "description": "The byteLength accessor property represents the length (in bytes) of this view from the start of its ArrayBuffer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/byteLength"
    }, 
    "DataView.prototype.byteOffset": {
        "description": "The byteOffset accessor property represents the offset (in bytes) of this view from the start of its ArrayBuffer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/byteOffset"
    }, 
    "DataView.prototype.getFloat32": {
        "description": "The getFloat32() method gets a signed 32-bit integer (float) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32", 
        "usage": "dataview.getFloat32(byteOffset [, littleEndian])"
    }, 
    "DataView.prototype.getFloat64": {
        "description": "The getFloat64() method gets a signed 64-bit float (double) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat64", 
        "usage": "dataview.getFloat64(byteOffset [, littleEndian])"
    }, 
    "DataView.prototype.getInt16": {
        "description": "The getInt16() method gets a signed 16-bit integer (short) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt16", 
        "usage": "dataview.getInt16(byteOffset [, littleEndian])"
    }, 
    "DataView.prototype.getInt32": {
        "description": "The getInt32() method gets a signed 32-bit integer (long) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt32", 
        "usage": "dataview.getInt32(byteOffset [, littleEndian])"
    }, 
    "DataView.prototype.getInt8": {
        "description": "The getInt8() method gets a signed 8-bit integer (byte) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt8", 
        "usage": "dataview.getInt8(byteOffset)"
    }, 
    "DataView.prototype.getUint16": {
        "description": "The getUint16() method gets an unsigned 16-bit integer (unsigned short) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint16", 
        "usage": "dataview.getUint16(byteOffset [, littleEndian])"
    }, 
    "DataView.prototype.getUint32": {
        "description": "The getUint32() method gets an unsigned 32-bit integer (unsigned long) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32", 
        "usage": "dataview.getUint32(byteOffset [, littleEndian])"
    }, 
    "DataView.prototype.getUint8": {
        "description": "The getUint8() method gets an unsigned 8-bit integer (unsigned byte) at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint8", 
        "usage": "dataview.getUint8(byteOffset)"
    }, 
    "DataView.prototype.setFloat32": {
        "description": "The setFloat32() method stores a signed 32-bit integer (float) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setFloat32", 
        "usage": "dataview.setFloat32(byteOffset, value [, littleEndian])"
    }, 
    "DataView.prototype.setFloat64": {
        "description": "The setFloat64() method stores a signed 64-bit integer (double) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setFloat64", 
        "usage": "dataview.setFloat64(byteOffset, value [, littleEndian])"
    }, 
    "DataView.prototype.setInt16": {
        "description": "The setInt16() method stores a signed 16-bit integer (short) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setInt16", 
        "usage": "dataview.setInt16(byteOffset, value [, littleEndian])"
    }, 
    "DataView.prototype.setInt32": {
        "description": "The setInt32() method stores a signed 32-bit integer (long) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setInt32", 
        "usage": "dataview.setInt32(byteOffset, value [, littleEndian])"
    }, 
    "DataView.prototype.setInt8": {
        "description": "The setInt8() method stores a signed 8-bit integer (byte) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setInt8", 
        "usage": "dataview.setInt8(byteOffset, value)"
    }, 
    "DataView.prototype.setUint16": {
        "description": "The setUint16() method stores an unsigned 16-bit integer (unsigned short) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setUint16", 
        "usage": "dataview.setUint16(byteOffset, value [, littleEndian])"
    }, 
    "DataView.prototype.setUint32": {
        "description": "The setUint32() method stores an unsigned 32-bit integer (unsigned long) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setUint32", 
        "usage": "dataview.setUint32(byteOffset, value [, littleEndian])"
    }, 
    "DataView.prototype.setUint8": {
        "description": "The setUint8() method stores an unsigned 8-bit integer (byte) value at the specified byte offset from the start of the DataView.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setUint8", 
        "usage": "dataview.setUint8(byteOffset, value)"
    }, 
    "Date": {
        "description": "Creates a JavaScript Date instance that represents a single moment in time. Date objects are based on a time value that is the number of milliseconds since 1 January, 1970 UTC.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date", 
        "usage": "new Date();\nnew Date(value);\nnew Date(dateString);\nnew Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);\n\nParameters\n  value\n    Integer value representing the number of milliseconds since 1\n    January 1970 00:00:00 UTC (Unix Epoch).\n  dateString\n    String value representing a date. The string should be in a format\n    recognized by the Date.parse() method (IETF-compliant RFC 2822\n    timestamps and also a version of ISO8601).\n  year\n    Integer value representing the year. Values from 0 to 99 map to\n    the years 1900 to 1999. See the example below.\n  month\n    Integer value representing the month, beginning with 0 for January\n    to 11 for December.\n  day\n    Optional. Integer value representing the day of the month.\n  hour\n    Optional. Integer value representing the hour of the day.\n  minute\n    Optional. Integer value representing the minute segment of a time.\n  second\n    Optional. Integer value representing the second segment of a time.\n  millisecond\n    Optional. Integer value representing the millisecond segment of a\n    time."
    }, 
    "Date.UTC": {
        "description": "The Date.UTC() method accepts the same parameters as the longest form of the constructor, and returns the number of milliseconds in a Date object since January 1, 1970, 00:00:00, universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC", 
        "usage": "Date.UTC(year, month[, day[, hour[, minute[, second[, millisecond]]]]])\nParameters\n  year\n    A year after 1900.\n  month\n    An integer between 0 and 11 representing the month.\n  day\n    Optional. An integer between 1 and 31 representing the day of the\n    month.\n  hour\n    Optional. An integer between 0 and 23 representing the hours.\n  minute\n    Optional. An integer between 0 and 59 representing the minutes.\n  second\n    Optional. An integer between 0 and 59 representing the seconds.\n  millisecond\n    Optional. An integer between 0 and 999 representing the\n    milliseconds."
    }, 
    "Date.now": {
        "description": "The Date.now() method returns the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now", 
        "usage": "var timeInMs = Date.now();"
    }, 
    "Date.parse": {
        "description": "The Date.parse() method parses a string representation of a date, and returns the number of milliseconds since January 1, 1970, 00:00:00 UTC.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse", 
        "usage": "Date.parse(dateString)\nParameters\n  dateString\n    A string representing an RFC2822 or ISO 8601 date (other formats\n    may be used, but results may be unexpected)."
    }, 
    "Date.prototype": {
        "description": "The Date.prototype property represents the prototype for the Date constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/prototype"
    }, 
    "Date.prototype.getDate": {
        "description": "The getDate() method returns the day of the month for the specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate", 
        "usage": "dateObj.getDate()"
    }, 
    "Date.prototype.getDay": {
        "description": "The getDay() method returns the day of the week for the specified date according to local time, where 0 represents Sunday.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay", 
        "usage": "dateObj.getDay()"
    }, 
    "Date.prototype.getFullYear": {
        "description": "The getFullYear() method returns the year of the specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear", 
        "usage": "dateObj.getFullYear()"
    }, 
    "Date.prototype.getHours": {
        "description": "The getHours() method returns the hour for the specified date, according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getHours", 
        "usage": "dateObj.getHours()"
    }, 
    "Date.prototype.getMilliseconds": {
        "description": "The getMilliseconds() method returns the milliseconds in the specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMilliseconds", 
        "usage": "dateObj.getMilliseconds()"
    }, 
    "Date.prototype.getMinutes": {
        "description": "The getMinutes() method returns the minutes in the specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMinutes", 
        "usage": "dateObj.getMinutes()"
    }, 
    "Date.prototype.getMonth": {
        "description": "The getMonth() method returns the month in the specified date according to local time, as a zero-based value (where zero indicates the first month of the year).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth", 
        "usage": "dateObj.getMonth()"
    }, 
    "Date.prototype.getSeconds": {
        "description": "The getSeconds() method returns the seconds in the specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getSeconds", 
        "usage": "dateObj.getSeconds()"
    }, 
    "Date.prototype.getTime": {
        "description": "The getTime() method returns the numeric value corresponding to the time for the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime", 
        "usage": "dateObj.getTime()"
    }, 
    "Date.prototype.getTimezoneOffset": {
        "description": "The getTimezoneOffset() method returns the time-zone offset from UTC, in minutes, for the current locale.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset", 
        "usage": "dateObj.getTimezoneOffset()"
    }, 
    "Date.prototype.getUTCDate": {
        "description": "The getUTCDate() method returns the day (date) of the month in the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDate", 
        "usage": "dateObj.getUTCDate()"
    }, 
    "Date.prototype.getUTCDay": {
        "description": "The getUTCDay() method returns the day of the week in the specified date according to universal time, where 0 represents Sunday.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDay", 
        "usage": "dateObj.getUTCDay()"
    }, 
    "Date.prototype.getUTCFullYear": {
        "description": "The getUTCFullYear() method returns the year in the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCFullYear", 
        "usage": "dateObj.getUTCFullYear()"
    }, 
    "Date.prototype.getUTCHours": {
        "description": "The getUTCHours() method returns the hours in the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCHours", 
        "usage": "dateObj.getUTCHours()"
    }, 
    "Date.prototype.getUTCMilliseconds": {
        "description": "The getUTCMilliseconds() method returns the milliseconds in the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMilliseconds", 
        "usage": "dateObj.getUTCMilliseconds()"
    }, 
    "Date.prototype.getUTCMinutes": {
        "description": "The getUTCMinutes() method returns the minutes in the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMinutes", 
        "usage": "dateObj.getUTCMinutes()"
    }, 
    "Date.prototype.getUTCMonth": {
        "description": "The getUTCMonth() returns the month of the specified date according to universal time, as a zero-based value (where zero indicates the first month of the year).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMonth", 
        "usage": "dateObj.getUTCMonth()"
    }, 
    "Date.prototype.getUTCSeconds": {
        "description": "The getUTCSeconds() method returns the seconds in the specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCSeconds", 
        "usage": "dateObj.getUTCSeconds()"
    }, 
    "Date.prototype.getYear": {
        "description": "The getYear() method returns the year in the specified date according to local time. Because getYear() does not return full years (\"year 2000 problem\"), it is no longer used and has been replaced by the getFullYear() method.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getYear", 
        "usage": "dateObj.getYear()"
    }, 
    "Date.prototype.setDate": {
        "description": "The setDate() method sets the day of the month for a specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate", 
        "usage": "dateObj.setDate(dayValue)\nParameters\n  dayValue\n    An integer representing the day of the month."
    }, 
    "Date.prototype.setFullYear": {
        "description": "The setFullYear() method sets the full year for a specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setFullYear", 
        "usage": "dateObj.setFullYear(yearValue[, monthValue[, dayValue]])\nParameters\n  yearValue\n    An integer specifying the numeric value of the year, for example,\n    1995.\n  monthValue\n    Optional. An integer between 0 and 11 representing the months\n    January through December.\n  dayValue\n    Optional. An integer between 1 and 31 representing the day of the\n    month. If you specify the dayValue parameter, you must also\n    specify the monthValue."
    }, 
    "Date.prototype.setHours": {
        "description": "The setHours() method sets the hours for a specified date according to local time, and returns the number of milliseconds since 1 January 1970 00:00:00 UTC until the time represented by the updated Date instance.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours", 
        "usage": "dateObj.setHours(hoursValue[, minutesValue[, secondsValue[, msValue]]])\nParameters\n  hoursValue\n    An integer between 0 and 23, representing the hour.\n  minutesValue\n    Optional. An integer between 0 and 59, representing the minutes.\n  secondsValue\n    Optional. An integer between 0 and 59, representing the seconds.\n    If you specify the secondsValue parameter, you must also specify\n    the minutesValue.\n  msValue\n    Optional. A number between 0 and 999, representing the\n    milliseconds. If you specify the msValue parameter, you must also\n    specify the minutesValue and secondsValue."
    }, 
    "Date.prototype.setMilliseconds": {
        "description": "The setMilliseconds() method sets the milliseconds for a specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMilliseconds", 
        "usage": "dateObj.setMilliseconds(millisecondsValue)\nParameters\n  millisecondsValue\n    A number between 0 and 999, representing the milliseconds."
    }, 
    "Date.prototype.setMinutes": {
        "description": "The setMinutes() method sets the minutes for a specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMinutes", 
        "usage": "dateObj.setMinutes(minutesValue[, secondsValue[, msValue]])\nParameters\n  minutesValue\n    An integer between 0 and 59, representing the minutes.\n  secondsValue\n    Optional. An integer between 0 and 59, representing the seconds.\n    If you specify the secondsValue parameter, you must also specify\n    the minutesValue.\n  msValue\n    Optional. A number between 0 and 999, representing the\n    milliseconds. If you specify the msValue parameter, you must also\n    specify the minutesValue and secondsValue."
    }, 
    "Date.prototype.setMonth": {
        "description": "The setMonth() method sets the month for a specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth", 
        "usage": "dateObj.setMonth(monthValue[, dayValue])"
    }, 
    "Date.prototype.setSeconds": {
        "description": "The setSeconds() method sets the seconds for a specified date according to local time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setSeconds", 
        "usage": "dateObj.setSeconds(secondsValue[, msValue])\nParameters\n  secondsValue\n    An integer between 0 and 59, representing the seconds.\n  msValue\n    Optional. A number between 0 and 999, representing the\n    milliseconds."
    }, 
    "Date.prototype.setTime": {
        "description": "The setTime() method sets the Date object to the time represented by a number of milliseconds since January 1, 1970, 00:00:00 UTC.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime", 
        "usage": "dateObj.setTime(timeValue)\nParameters\n  timeValue\n    An integer representing the number of milliseconds since 1 January\n    1970, 00:00:00 UTC."
    }, 
    "Date.prototype.setUTCDate": {
        "description": "The setUTCDate() method sets the day of the month for a specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCDate", 
        "usage": "dateObj.setUTCDate(dayValue)\nParameters\n  dayValue\n    An integer from 1 to 31, representing the day of the month."
    }, 
    "Date.prototype.setUTCFullYear": {
        "description": "The setUTCFullYear() method sets the full year for a specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCFullYear", 
        "usage": "dateObj.setUTCFullYear(yearValue[, monthValue[, dayValue]])\nParameters\n  yearValue\n    An integer specifying the numeric value of the year, for example,\n    1995.\n  monthValue\n    Optional. An integer between 0 and 11 representing the months\n    January through December.\n  dayValue\n    Optional. An integer between 1 and 31 representing the day of the\n    month. If you specify the dayValue parameter, you must also\n    specify the monthValue."
    }, 
    "Date.prototype.setUTCHours": {
        "description": "The setUTCHours() method sets the hour for a specified date according to universal time, and returns the number of milliseconds since 1 January 1970 00:00:00 UTC until the time represented by the updated Date instance.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCHours", 
        "usage": "dateObj.setUTCHours(hoursValue[, minutesValue[, secondsValue[, msValue]]])\nParameters\n  hoursValue\n    An integer between 0 and 23, representing the hour.\n  minutesValue\n    Optional. An integer between 0 and 59, representing the minutes.\n  secondsValue\n    Optional. An integer between 0 and 59, representing the seconds.\n    If you specify the secondsValue parameter, you must also specify\n    the minutesValue.\n  msValue\n    Optional. A number between 0 and 999, representing the\n    milliseconds. If you specify the msValue parameter, you must also\n    specify the minutesValue and secondsValue."
    }, 
    "Date.prototype.setUTCMilliseconds": {
        "description": "The setUTCMilliseconds() method sets the milliseconds for a specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMilliseconds", 
        "usage": "dateObj.setUTCMilliseconds(millisecondsValue)\nParameters\n  millisecondsValue\n    A number between 0 and 999, representing the milliseconds."
    }, 
    "Date.prototype.setUTCMinutes": {
        "description": "The setUTCMinutes() method sets the minutes for a specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMinutes", 
        "usage": "dateObj.setUTCMinutes(minutesValue[, secondsValue[, msValue]])\nParameters\n  minutesValue\n    An integer between 0 and 59, representing the minutes.\n  secondsValue\n    Optional. An integer between 0 and 59, representing the seconds.\n    If you specify the secondsValue parameter, you must also specify\n    the minutesValue.\n  msValue\n    Optional. A number between 0 and 999, representing the\n    milliseconds. If you specify the msValue parameter, you must also\n    specify the minutesValue and secondsValue."
    }, 
    "Date.prototype.setUTCMonth": {
        "description": "The setUTCMonth() method sets the month for a specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMonth", 
        "usage": "dateObj.setUTCMonth(monthValue[, dayValue])\nParameters\n  monthValue\n    An integer between 0 and 11, representing the months January\n    through December.\n  dayValue\n    Optional. An integer from 1 to 31, representing the day of the\n    month."
    }, 
    "Date.prototype.setUTCSeconds": {
        "description": "The setUTCSeconds() method sets the seconds for a specified date according to universal time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCSeconds", 
        "usage": "dateObj.setUTCSeconds(secondsValue[, msValue])\nParameters\n  secondsValue\n    An integer between 0 and 59, representing the seconds.\n  msValue\n    Optional. A number between 0 and 999, representing the\n    milliseconds."
    }, 
    "Date.prototype.setYear": {
        "description": "The setYear() method sets the year for a specified date according to local time. Because setYear() does not set full years (\"year 2000 problem\"), it is no longer used and has been replaced by the setFullYear() method.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setYear", 
        "usage": "dateObj.setYear(yearValue)\nParameters\n  yearValue\n    An integer."
    }, 
    "Date.prototype.toDateString": {
        "description": "The toDateString() method returns the date portion of a Date object in human readable form in American English.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString", 
        "usage": "dateObj.toDateString()"
    }, 
    "Date.prototype.toGMTString": {
        "description": "The toGMTString() method converts a date to a string, using Internet Greenwich Mean Time (GMT) conventions. The exact format of the value returned by toGMTString() varies according to the platform and browser, in general it should represent a human readable date string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toGMTString", 
        "usage": "dateObj.toGMTString()"
    }, 
    "Date.prototype.toISOString": {
        "description": "The toISOString() method returns a string in ISO format (ISO 8601 Extended Format), which can be described as follows: YYYY-MM-DDTHH:mm:ss.sssZ. The timezone is always UTC as denoted by the suffix \"Z\".", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString", 
        "usage": "dateObj.toISOString()"
    }, 
    "Date.prototype.toJSON": {
        "description": "The toJSON() method returns a JSON representation of the Date object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON", 
        "usage": "dateObj.toJSON()"
    }, 
    "Date.prototype.toLocaleDateString": {
        "description": "The toLocaleDateString() method returns a string with a language sensitive representation of the date portion of this date. The new locales and options arguments let applications specify the language whose formatting conventions should be used and allow to customize the behavior of the function. In older implementations, which ignore the locales and options arguments, the locale used and the form of the string returned are entirely implementation dependent.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString", 
        "usage": "dateObj.toLocaleDateString([locales [, options]])"
    }, 
    "Date.prototype.toLocaleFormat": {
        "description": "The non-standard toLocaleFormat() method converts a date to a string using the specified formatting. Intl.DateTimeFormat is an alternative to format dates in a standards-compliant way. See also the newer version of Date.prototype.toLocaleDateString().", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleFormat", 
        "usage": "dateObj.toLocaleFormat(formatString)\nParameters\n  formatString\n    A format string in the same format expected by the strftime()\n    function in C."
    }, 
    "Date.prototype.toLocaleString": {
        "description": "The toLocaleString() method returns a string with a language sensitive representation of this date. The new locales and options arguments let applications specify the language whose formatting conventions should be used and customize the behavior of the function. In older implementations, which ignore the locales and options arguments, the locale used and the form of the string returned are entirely implementation dependent.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString", 
        "usage": "dateObj.toLocaleString([locales[, options]])"
    }, 
    "Date.prototype.toLocaleTimeString": {
        "description": "The toLocaleTimeString() method returns a string with a language sensitive representation of the time portion of this date. The new locales and options arguments let applications specify the language whose formatting conventions should be used and customize the behavior of the function. In older implementations, which ignore the locales and options arguments, the locale used and the form of the string returned are entirely implementation dependent.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString", 
        "usage": "dateObj.toLocaleTimeString([locales[, options]])"
    }, 
    "Date.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toSource", 
        "usage": "dateObj.toSource()\nDate.toSource()"
    }, 
    "Date.prototype.toString": {
        "description": "The toString() method returns a string representing the specified Date object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toString", 
        "usage": "dateObj.toString()"
    }, 
    "Date.prototype.toTimeString": {
        "description": "The toTimeString() method returns the time portion of a Date object in human readable form in American English.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toTimeString", 
        "usage": "dateObj.toTimeString()"
    }, 
    "Date.prototype.toUTCString": {
        "description": "The toUTCString() method converts a date to a string, using the UTC time zone.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString", 
        "usage": "dateObj.toUTCString()"
    }, 
    "Date.prototype.valueOf": {
        "description": "The valueOf() method returns the primitive value of a Date object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/valueOf", 
        "usage": "dateObj.valueOf()"
    }, 
    "Error": {
        "description": "The Error constructor creates an error object. Instances of Error objects are thrown when runtime errors occur. The Error object can also be used as a base objects for user-defined exceptions. See below for standard built-in error types.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error", 
        "usage": "new Error([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error.\n  fileName\n    Optional. The value for the fileName property on the created Error\n    object. Defaults to the name of the file containing the code that\n    called the Error() constructor.\n  lineNumber\n    Optional. The value for the lineNumber property on the created\n    Error object. Defaults to the line number containing the Error()\n    constructor invocation."
    }, 
    "Error.prototype": {
        "description": "The Error.prototype property represents the prototype for the Error constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype"
    }, 
    "Error.prototype.columnNumber": {
        "description": "The columnNumber property contains the column number in the line of the file that raised this error.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/columnNumber"
    }, 
    "Error.prototype.fileName": {
        "description": "The fileName property contains the path to the file that raised this error.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/fileName"
    }, 
    "Error.prototype.lineNumber": {
        "description": "The lineNumber property contains the line number in the file that raised this error.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/lineNumber"
    }, 
    "Error.prototype.message": {
        "description": "The message property is a human-readable description of the error.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message"
    }, 
    "Error.prototype.name": {
        "description": "The name property represents a name for the type of error. The initial value is \"Error\".", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name"
    }, 
    "Error.prototype.stack": {
        "description": "The non-standard stack property of Error objects offer a trace of which functions were called, in what order, from which line and file, and with what arguments. The stack string proceeds from the most recent calls to earlier ones, leading back to the original global scope call.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack"
    }, 
    "Error.prototype.toSource": {
        "description": "The toSource() method returns code that could eval to the same error.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toSource", 
        "usage": "e.toSource()"
    }, 
    "Error.prototype.toString": {
        "description": "The toString() method returns a string representing the specified Error object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString", 
        "usage": "e.toString()"
    }, 
    "EvalError": {
        "description": "The EvalError object indicates an error regarding the global eval() function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError", 
        "usage": "new EvalError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "Float32Array": {
        "description": "The Float32Array typed array represents an array of 32-bit floating point numbers (corresponding to the C float data type) in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array", 
        "usage": "Float32Array(length);\nFloat32Array(typedArray);\nFloat32Array(object);\nFloat32Array(buffer [, byteOffset [, length]]);"
    }, 
    "Float64Array": {
        "description": "The Float64Array typed array represents an array of 64-bit floating point numbers (corresponding to the C double data type) in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array", 
        "usage": "Float64Array(length);\nFloat64Array(typedArray);\nFloat64Array(object);\nFloat64Array(buffer [, byteOffset [, length]]);"
    }, 
    "Function": {
        "description": "The Function constructor creates a new Function object. In JavaScript every function is actually a Function object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function", 
        "usage": "new Function ([arg1[, arg2[, ...argN]],] functionBody)\nParameters\n  arg1, arg2, ... argN\n    Names to be used by the function as formal argument names. Each\n    must be a string that corresponds to a valid JavaScript identifier\n    or a list of such strings separated with a comma; for example \"x\",\n    \"theValue\", or \"a,b\".\n  functionBody\n    A string containing the JavaScript statements comprising the\n    function definition."
    }, 
    "Function.arguments": {
        "description": "The function.arguments property refers to an array-like object corresponding to the arguments passed to a function. Use the simple variable arguments instead.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/arguments", 
        "usage": "The function.arguments property refers to an an array-like object corresponding to the arguments passed to a function. Use the simple variable arguments instead."
    }, 
    "Function.arity": {
        "description": "The arity property used to return the number of arguments expected by the function, however, it no longer exists and has been replaced by the Function.prototype.length property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/arity"
    }, 
    "Function.caller": {
        "description": "The function.caller property returns the function that invoked the specified function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/caller"
    }, 
    "Function.displayName": {
        "description": "The function.displayName property returns the display name of the function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/displayName"
    }, 
    "Function.length": {
        "description": "The length property specifies the number of arguments expected by the function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length"
    }, 
    "Function.name": {
        "description": "The function.name property returns the name of the function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name"
    }, 
    "Function.prototype": {
        "description": "The Function.prototype property represents the Function prototype object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype"
    }, 
    "Function.prototype.apply": {
        "description": "The apply() method calls a function with a given this value and arguments provided as an array (or an array-like object).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply", 
        "usage": "fun.apply(thisArg, [argsArray])\nParameters\n  thisArg\n    The value of this provided for the call to fun. Note that this may\n    not be the actual value seen by the method: if the method is a\n    function in non-strict mode code, null and undefined will be\n    replaced with the global object, and primitive values will be\n    boxed.\n  argsArray\n    An array-like object, specifying the arguments with which fun\n    should be called, or null or undefined if no arguments should be\n    provided to the function. Starting with ECMAScript 5 these\n    arguments can be a generic array-like object instead of an array.\n    See below for browser compatibility information."
    }, 
    "Function.prototype.bind": {
        "description": "The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind", 
        "usage": "fun.bind(thisArg[, arg1[, arg2[, ...]]])\nParameters\n  thisArg\n    The value to be passed as the this parameter to the target\n    function when the bound function is called. The value is ignored\n    if the bound function is constructed using the new operator.\n  arg1, arg2, ...\n    Arguments to prepend to arguments provided to the bound function\n    when invoking the target function."
    }, 
    "Function.prototype.call": {
        "description": "The call() method calls a function with a given this value and arguments provided individually.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call", 
        "usage": "fun.call(thisArg[, arg1[, arg2[, ...]]])\nParameters\n  thisArg\n    The value of this provided for the call to fun. Note that this may\n    not be the actual value seen by the method: if the method is a\n    function in non-strict mode code, null and undefined will be\n    replaced with the global object, and primitive values will be\n    boxed.\n  arg1, arg2, ...\n    Arguments for the object."
    }, 
    "Function.prototype.isGenerator": {
        "description": "The isGenerator() method determines whether or not a function is a generator.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/isGenerator", 
        "usage": "fun.isGenerator()"
    }, 
    "Function.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toSource", 
        "usage": "function.toSource();\nFunction.toSource();\n"
    }, 
    "Function.prototype.toString": {
        "description": "The toString() method returns a string representing the source code of the function.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString", 
        "usage": "function.toString(indentation)\nParameters\n  indentation   Obsolete since Gecko 17\n    The amount of spaces to indent the string representation of the\n    source code. If indentation is less than or equal to -1, most\n    unnecessary spaces are removed."
    }, 
    "Generator": {
        "description": "The Generator object is returned by a generator function and it conforms to both the iterator and the Iterable protocol.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator", 
        "usage": "function* gen() { \n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nvar g = gen(); // \"Generator { }\""
    }, 
    "Generator.prototype.next": {
        "description": "The next() method returns an object with two properties done and value. You can also provide a parameter to the next method to send a value to the generator.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next", 
        "usage": "gen.next(value)\nParameters\n  value\n    The value to send to the generator.\nReturns\nAn Object with two properties:"
    }, 
    "Generator.prototype.return": {
        "description": "The return() method returns the given value and finishes the generator.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return", 
        "usage": "gen.return(value)\nParameters\n  value\n    The value to return.\nReturns\nReturns the value that is given as an argument to this function."
    }, 
    "Generator.prototype.throw": {
        "description": "The throw() method throws an error to a generator.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw", 
        "usage": "gen.throw(exception)\nParameters\n  exception\n    The exception to throw. For debugging purposes, it is useful to\n    make it an instanceof Error."
    }, 
    "GeneratorFunction": {
        "description": "The GeneratorFunction constructor creates a new generator function object. In JavaScript every generator function is actually a GeneratorFunction object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction", 
        "usage": "new GeneratorFunction ([arg1[, arg2[, ...argN]],] functionBody)\nParameters\n  arg1, arg2, ... argN\n    Names to be used by the function as formal argument names. Each\n    must be a string that corresponds to a valid JavaScript identifier\n    or a list of such strings separated with a comma; for example \"x\",\n    \"theValue\", or \"a,b\".\n  functionBody\n    A string containing the JavaScript statements comprising the\n    function definition."
    }, 
    "GeneratorFunction.length": {
        "description": "The GeneratorFunction constructor's length property whose value is 1.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction"
    }, 
    "GeneratorFunction.prototype": {
        "description": "The GeneratorFunction.prototype property represents the prototype for the GeneratorFunction constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction/prototype"
    }, 
    "Infinity": {
        "description": "The global Infinity property is a numeric value representing infinity.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity", 
        "usage": "Infinity "
    }, 
    "Int16Array": {
        "description": "The Int16Array typed array represents an array of twos-complement 16-bit signed integers in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array", 
        "usage": "Int16Array(length);\nInt16Array(typedArray);\nInt16Array(object);\nInt16Array(buffer [, byteOffset [, length]]);"
    }, 
    "Int32Array": {
        "description": "The Int32Array typed array represents an array of twos-complement 32-bit signed integers in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array", 
        "usage": "Int32Array(length);\nInt32Array(typedArray);\nInt32Array(object);\nInt32Array(buffer [, byteOffset [, length]]);"
    }, 
    "Int8Array": {
        "description": "The Int8Array typed array represents an array of twos-complement 8-bit signed integers. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array", 
        "usage": "Int8Array(length);\nInt8Array(typedArray);\nInt8Array(object);\nInt8Array(buffer [, byteOffset [, length]]);"
    }, 
    "InternalError": {
        "description": "The InternalError object indicates an error that occurred internally in the JavaScript engine. For example: \"InternalError: too much recursion\".", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError", 
        "usage": "new InternalError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "Intl": {
        "description": "The Intl object is the namespace for the ECMAScript Internationalization API, which provides language sensitive string comparison, number formatting, and date and time formatting. The constructors for Collator, NumberFormat, and DateTimeFormat objects are properties of the Intl object. This page documents these properties as well as functionality common to the internationalization constructors and other language sensitive functions.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl"
    }, 
    "Intl.Collator": {
        "description": "The Intl.Collator object is a constructor for collators, objects that enable language sensitive string comparison.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator", 
        "usage": "new Intl.Collator([locales[, options]])\nIntl.Collator.call(this[, locales[, options]])\nParameters\n  locales\n    Optional. A string with a BCP 47 language tag, or an array of such\n    strings. For the general form and interpretation of the locales\n    argument, see the Intl page. The following Unicode extension keys\n    are allowed:  co Variant collations for certain locales. Possible\n    values include: \"big5han\", \"dict\", \"direct\", \"ducet\", \"gb2312\",\n    \"phonebk\", \"phonetic\", \"pinyin\", \"reformed\", \"searchjl\", \"stroke\",\n    \"trad\", \"unihan\". The \"standard\" and \"search\" values are ignored;\n    they are replaced by the options property usage (see below). kn\n    Whether numeric collation should be used, such that \"1\" < \"2\" <\n    \"10\". Possible values are \"true\" and \"false\". This option can be\n    set through an options property or through a Unicode extension\n    key; if both are provided, the options property takes precedence.\n    kf Whether upper case or lower case should sort first. Possible\n    values are \"upper\", \"lower\", or \"false\" (use the locale's\n    default). This option can be set through an options property or\n    through a Unicode extension key; if both are provided, the options\n    property takes precedence.\n  options\n    Optional. An object with some or all of the following properties:\n    localeMatcher The locale matching algorithm to use. Possible\n    values are \"lookup\" and \"best fit\"; the default is \"best fit\". For\n    information about this option, see the Intl page. usage Whether\n    the comparison is for sorting or for searching for matching\n    strings. Possible values are \"sort\" and \"search\"; the default is\n    \"sort\". sensitivity  Which differences in the strings should lead\n    to non-zero result values. Possible values are:  \"base\": Only\n    strings that differ in base letters compare as unequal. Examples:\n    a != b, a = a, a = A. \"accent\": Only strings that differ in base\n    letters or accents and other diacritic marks compare as unequal.\n    Examples: a != b, a != a, a = A. \"case\": Only strings that differ\n    in base letters or case compare as unequal. Examples: a != b, a =\n    a, a != A. \"variant\": Strings that differ in base letters, accents\n    and other diacritic marks, or case compare as unequal. Other\n    differences may also be taken into consideration. Examples: a != b,\n    a != a, a != A.  The default is \"variant\" for usage \"sort\"; it's\n    locale dependent for usage \"search\".  ignorePunctuation Whether\n    punctuation should be ignored. Possible values are true and false;\n    the default is false. numeric Whether numeric collation should be\n    used, such that \"1\" < \"2\" < \"10\". Possible values are true and\n    false; the default is false. This option can be set through an\n    options property or through a Unicode extension key; if both are\n    provided, the options property takes precedence. Implementations\n    are not required to support this property. caseFirst Whether upper\n    case or lower case should sort first. Possible values are \"upper\",\n    \"lower\", or \"false\" (use the locale's default); the default is\n    \"false\". This option can be set through an options property or\n    through a Unicode extension key; if both are provided, the options\n    property takes precedence. Implementations are not required to\n    support this property."
    }, 
    "Intl.Collator.prototype": {
        "description": "The Intl.Collator.prototype property represents the prototype object for the Intl.Collator constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/prototype"
    }, 
    "Intl.Collator.prototype.compare": {
        "description": "The Intl.Collator.prototype.compare property returns a getter function that compares two strings according to the sort order of this Collator object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/compare"
    }, 
    "Intl.Collator.prototype.resolvedOptions": {
        "description": "The Intl.Collator.prototype.resolvedOptions() method returns a new object with properties reflecting the locale and collation options computed during initialization of this Collator object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/resolvedOptions", 
        "usage": "collator.resolvedOptions()"
    }, 
    "Intl.Collator.supportedLocalesOf": {
        "description": "The Intl.Collator.supportedLocalesOf() method returns an array containing those of the provided locales that are supported in collation without having to fall back to the runtime's default locale.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/supportedLocalesOf", 
        "usage": "Intl.Collator.supportedLocalesOf(locales[, options])\nParameters\n  locales\n    A string with a BCP 47 language tag, or an array of such strings.\n    For the general form of the locales argument, see the Intl page.\n  options\n    Optional. An object that may have the following property:\n    localeMatcher The locale matching algorithm to use. Possible\n    values are \"lookup\" and \"best fit\"; the default is \"best fit\". For\n    information about this option, see the Intl page."
    }, 
    "Intl.DateTimeFormat": {
        "description": "The Intl.DateTimeFormat object is a constructor for objects that enable language sensitive date and time formatting.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat", 
        "usage": "new Intl.DateTimeFormat([locales[, options]])\nIntl.DateTimeFormat.call(this[, locales[, options]])\nParameters\n  locales\n    Optional. A string with a BCP 47 language tag, or an array of such\n    strings. For the general form and interpretation of the locales\n    argument, see the Intl page. The following Unicode extension keys\n    are allowed:  nu Numbering system. Possible values include:\n    \"arab\", \"arabext\", \"bali\", \"beng\", \"deva\", \"fullwide\", \"gujr\",\n    \"guru\", \"hanidec\", \"khmr\", \"knda\", \"laoo\", \"latn\", \"limb\", \"mlym\",\n    \"mong\", \"mymr\", \"orya\", \"tamldec\", \"telu\", \"thai\", \"tibt\". ca\n    Calendar. Possible values include: \"buddhist\", \"chinese\",\n    \"coptic\", \"ethioaa\", \"ethiopic\", \"gregory\", \"hebrew\", \"indian\",\n    \"islamic\", \"islamicc\", \"iso8601\", \"japanese\", \"persian\", \"roc\".\n  options\n    Optional. An object with some or all of the following properties:\n    localeMatcher The locale matching algorithm to use. Possible\n    values are \"lookup\" and \"best fit\"; the default is \"best fit\". For\n    information about this option, see the Intl page. timeZone The\n    time zone to use. The only value implementations must recognize is\n    \"UTC\"; the default is the runtime's default time zone.\n    Implementations may also recognize the time zone names of the IANA\n    time zone database, such as \"Asia/Shanghai\", \"Asia/Kolkata\",\n    \"America/New_York\". hour12 Whether to use 12-hour time (as opposed\n    to 24-hour time). Possible values are true and false; the default\n    is locale dependent. formatMatcher The format matching algorithm\n    to use. Possible values are \"basic\" and \"best fit\"; the default is\n    \"best fit\". See the following paragraphs for information about the\n    use of this property.  The following properties describe the date-\n    time components to use in formatted output, and their desired\n    representations. Implementations are required to support at least\n    the following subsets:  weekday, year, month, day, hour, minute,\n    second weekday, year, month, day year, month, day year, month\n    month, day hour, minute, second hour, minute  Implementations may\n    support other subsets, and requests will be negotiated against all\n    available subset-representation combinations to find the best\n    match. Two algorithms are available for this negotiation and\n    selected by the formatMatcher property: A fully specified \"basic\"\n    algorithm and an implementation dependent \"best fit\" algorithm.\n    weekday The representation of the weekday. Possible values are\n    \"narrow\", \"short\", \"long\". era The representation of the era.\n    Possible values are \"narrow\", \"short\", \"long\". year The\n    representation of the year. Possible values are \"numeric\",\n    \"2-digit\". month The representation of the month. Possible values\n    are \"numeric\", \"2-digit\", \"narrow\", \"short\", \"long\". day The\n    representation of the day. Possible values are \"numeric\",\n    \"2-digit\". hour The representation of the hour. Possible values\n    are \"numeric\", \"2-digit\". minute The representation of the minute.\n    Possible values are \"numeric\", \"2-digit\". second The\n    representation of the second. Possible values are \"numeric\",\n    \"2-digit\". timeZoneName The representation of the time zone name.\n    Possible values are \"short\", \"long\".  The default value for each\n    date-time component property is undefined, but if all component\n    properties are undefined, then year, month, and day are assumed to\n    be \"numeric\"."
    }, 
    "Intl.DateTimeFormat.prototype": {
        "description": "The Intl.DateTimeFormat.prototype property represents the prototype object for the Intl.DateTimeFormat constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/prototype"
    }, 
    "Intl.DateTimeFormat.prototype.format": {
        "description": "The format property returns a getter function that formats a date according to the locale and formatting options of this DateTimeFormat object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/format"
    }, 
    "Intl.DateTimeFormat.prototype.resolvedOptions": {
        "description": "The Intl.DateTimeFormat.prototype.resolvedOptions() method returns a new object with properties reflecting the locale and date and time formatting options computed during initialization of this DateTimeFormat object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions", 
        "usage": "dateTimeFormat.resolvedOptions()"
    }, 
    "Intl.DateTimeFormat.supportedLocalesOf": {
        "description": "The Intl.DateTimeFormat.supportedLocalesOf() method returns an array containing those of the provided locales that are supported in date and time formatting without having to fall back to the runtime's default locale.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/supportedLocalesOf", 
        "usage": "Intl.DateTimeFormat.supportedLocalesOf(locales[, options])\nParameters\n  locales\n    A string with a BCP 47 language tag, or an array of such strings.\n    For the general form of the locales argument, see the Intl page.\n  options\n    Optional. An object that may have the following property:\n    localeMatcher The locale matching algorithm to use. Possible\n    values are \"lookup\" and \"best fit\"; the default is \"best fit\". For\n    information about this option, see the Intl page."
    }, 
    "Intl.NumberFormat.prototype": {
        "description": "The Intl.NumberFormat.prototype property represents the prototype object for the Intl.NumberFormat constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/prototype"
    }, 
    "Intl.NumberFormat.prototype.format": {
        "description": "The Intl.NumberFormat.prototype.format property returns a getter function that formats a number according to the locale and formatting options of this NumberFormat object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/format"
    }, 
    "Intl.NumberFormat.prototype.resolvedOptions": {
        "description": "The Intl.NumberFormat.prototype.resolvedOptions() method returns a new object with properties reflecting the locale and number formatting options computed during initialization of this NumberFormat object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/resolvedOptions", 
        "usage": "numberFormat.resolvedOptions()"
    }, 
    "Intl.NumberFormat.supportedLocalesOf": {
        "description": "The Intl.NumberFormat.supportedLocalesOf() method returns an array containing those of the provided locales that are supported in number formatting without having to fall back to the runtime's default locale.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/supportedLocalesOf", 
        "usage": "Intl.NumberFormat.supportedLocalesOf(locales[, options])\nParameters\n  locales\n    A string with a BCP 47 language tag, or an array of such strings.\n    For the general form of the locales argument, see the Intl page.\n  options\n    Optional. An object that may have the following property:\n    localeMatcher The locale matching algorithm to use. Possible\n    values are \"lookup\" and \"best fit\"; the default is \"best fit\". For\n    information about this option, see the Intl page."
    }, 
    "Iterator": {
        "description": "The Iterator function returns an object which implements legacy iterator protocol and iterates over enumerable properties of an object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator", 
        "usage": "Iterator(object)\nParameters\n  object\n    Object to iterate over properties."
    }, 
    "JSON": {
        "description": "The JSON object contains methods for parsing JavaScript Object Notation (JSON) and converting values to JSON. It can't be called or constructed, and aside from its two method properties it has no interesting functionality of its own.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON"
    }, 
    "JSON.parse": {
        "description": "The JSON.parse() method parses a string as JSON, optionally transforming the value produced by parsing.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse", 
        "usage": "JSON.parse(text[, reviver])\nParameters\n  text\n    The string to parse as JSON. See the JSON object for a description\n    of JSON syntax.\n  reviver Optional\n    If a function, prescribes how the value originally produced by\n    parsing is transformed, before being returned.\nReturns\nReturns the Object corresponding to the given JSON text."
    }, 
    "JSON.stringify": {
        "description": "The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify", 
        "usage": "JSON.stringify(value[, replacer[, space]])\nParameters\n  value\n    The value to convert to a JSON string.\n  replacer Optional\n    If a function, transforms values and properties encountered while\n    stringifying; if an array, specifies the set of properties\n    included in objects in the final string.   A detailed description\n    of the replacer function is provided in the JavaScript guide\n    article Using native JSON.\n  space Optional\n    Causes the resulting string to be pretty-printed."
    }, 
    "Map": {
        "description": "The Map object is a simple key/value map. Any value (both objects and primitive values) may be used as either a key or a value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map", 
        "usage": "new Map([iterable])\n\nParameters\n  iterable\n    Iterable is an Array or other iterable object whose elements are\n    key-value pairs (2-element Arrays). Each key-value pair will be\n    added to the new Map. null is treated as undefined."
    }, 
    "Map.prototype": {
        "description": "The Map.prototype property represents the prototype for the Map constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/prototype"
    }, 
    "Map.prototype.clear": {
        "description": "The clear() method removes all elements from a Map object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear", 
        "usage": "myMap.clear();"
    }, 
    "Map.prototype.delete": {
        "description": "The delete() method removes the specified element from a Map object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete", 
        "usage": "myMap.delete(key);\nParameters\n  key\n    Required. The key of the element to remove from the Map object.\nReturns\nReturns true if an element in the Map object has been removed successfully."
    }, 
    "Map.prototype.entries": {
        "description": "The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries", 
        "usage": "myMap.entries()"
    }, 
    "Map.prototype.forEach": {
        "description": "The forEach() method executes a provided function once per each key/value pair in the Map object, in insertion order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach", 
        "usage": "myMap.forEach(callback[, thisArg])\nParameters\n  callback\n    Function to execute for each element.\n  thisArg\n    Value to use as this when executing callback."
    }, 
    "Map.prototype.get": {
        "description": "The get() method returns a specified element from a Map object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get", 
        "usage": "myMap.get(key);\nParameters\n  key\n    Required. The key of the element to return from the Map object.\nReturns\nReturns the element associated with the specified key or undefined if the key can't be found in the Map object."
    }, 
    "Map.prototype.has": {
        "description": "The has() method returns a boolean indicating whether an element with the specified key exists or not.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has", 
        "usage": "myMap.has(key);\nParameters\n  key\n    Required. The key of the element to test for presence in the Map\n    object."
    }, 
    "Map.prototype.keys": {
        "description": "The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys", 
        "usage": "myMap.keys()"
    }, 
    "Map.prototype.set": {
        "description": "The set() method adds a new element with a specified key and value to a Map object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set", 
        "usage": "myMap.set(key, value);\nParameters\n  key\n    Required. The key of the element to add to the Map object.\n  value\n    Required. The value of the element to add to the Map object.\nReturns\nThe Map object."
    }, 
    "Map.prototype.size": {
        "description": "The size accessor property returns the number of elements in a Map object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size"
    }, 
    "Map.prototype.values": {
        "description": "The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values", 
        "usage": "myMap.values()"
    }, 
    "Map.prototype[@@iterator]": {
        "description": "The initial value of the @@iterator property is the same function object as the initial value of the entries property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator", 
        "usage": "myMap[Symbol.iterator]"
    }, 
    "Math": {
        "description": "Math is a built-in object that has properties and methods for mathematical constants and functions. Not a function object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math"
    }, 
    "Math.E": {
        "description": "The Math.E property represents the base of natural logarithms, e, approximately 2.718.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/E"
    }, 
    "Math.LN10": {
        "description": "The Math.LN10 property represents the natural logarithm of 10, approximately 2.302:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN10"
    }, 
    "Math.LN2": {
        "description": "The Math.LN2 property represents the natural logarithm of 2, approximately 0.693:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2"
    }, 
    "Math.LOG10E": {
        "description": "The Math.LOG10E property represents the base 10 logarithm of e, approximately 0.434:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG10E"
    }, 
    "Math.LOG2E": {
        "description": "The Math.LOG2E property represents the base 2 logarithm of e, approximately 1.442:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/LOG2E"
    }, 
    "Math.PI": {
        "description": "The Math.PI property represents the ratio of the circumference of a circle to its diameter, approximately 3.14159:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI"
    }, 
    "Math.SQRT1_2": {
        "description": "The Math.SQRT1_2 property represents the square root of 1/2 which is approximately 0.707:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT1_2"
    }, 
    "Math.SQRT2": {
        "description": "The Math.SQRT2 property represents the square root of 2, approximately 1.414:", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT2"
    }, 
    "Math.abs": {
        "description": "The Math.abs() function returns the absolute value of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs", 
        "usage": "\nMath.abs(x)\nParameters\n  x\n    A number."
    }, 
    "Math.acos": {
        "description": "The Math.acos() function returns the arccosine (in radians) of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos", 
        "usage": "Math.acos(x)\nParameters\n  x\n    A number."
    }, 
    "Math.acosh": {
        "description": "The Math.acosh() function returns the hyperbolic arc-cosine of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh", 
        "usage": "Math.acosh(x)\nParameters\n  x\n    A number."
    }, 
    "Math.asin": {
        "description": "The Math.asin() function returns the arcsine (in radians) of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin", 
        "usage": "Math.asin(x)\nParameters\n  x\n    A number."
    }, 
    "Math.asinh": {
        "description": "The Math.asinh() function returns the hyperbolic arcsine of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh", 
        "usage": "Math.asinh(x)\nParameters\n  x\n    A number."
    }, 
    "Math.atan": {
        "description": "The Math.atan() function returns the arctangent (in radians) of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan", 
        "usage": "Math.atan(x)\nParameters\n  x\n    A number."
    }, 
    "Math.atan2": {
        "description": "The Math.atan2() function returns the arctangent of the quotient of its arguments.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2", 
        "usage": "Math.atan2(y, x)\nParameters\n  y\n    First number.\n  x\n    Second number."
    }, 
    "Math.atanh": {
        "description": "The Math.atanh() function returns the hyperbolic arctangent of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh", 
        "usage": "Math.atanh(x)\nParameters\n  x\n    A number."
    }, 
    "Math.cbrt": {
        "description": "The Math.cbrt() function returns the cube root of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt", 
        "usage": "Math.cbrt(x)\nParameters\n  x\n    A number."
    }, 
    "Math.ceil": {
        "description": "The Math.ceil(x) function returns the smallest integer greater than or equal to a number \"x\".", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil", 
        "usage": "Math.ceil(x)\nParameters\n  x\n    A number."
    }, 
    "Math.clz32": {
        "description": "The Math.clz32() function returns the number of leading zero bits in the 32-bit binary representation of a number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32", 
        "usage": "Math.clz32(x)\nParameters\n  x\n    A number."
    }, 
    "Math.cos": {
        "description": "The Math.cos() function returns the cosine of a number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos", 
        "usage": "Math.cos(x)\nParameters\n  x\n    A number given in unit of radians."
    }, 
    "Math.cosh": {
        "description": "The Math.cosh() function returns the hyperbolic cosine of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh", 
        "usage": "Math.cosh(x)\nParameters\n  x\n    A number."
    }, 
    "Math.exp": {
        "description": "The Math.exp() function returns ex, where x is the argument, and e is Euler's constant, the base of the natural logarithms.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/exp", 
        "usage": "Math.exp(x)\nParameters\n  x\n    A number."
    }, 
    "Math.expm1": {
        "description": "The Math.expm1() function returns ex - 1, where x is the argument, and e the base of the natural logarithms.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1", 
        "usage": "Math.expm1(x)\nParameters\n  x\n    A number."
    }, 
    "Math.floor": {
        "description": "The Math.floor(x) function returns the largest integer less than or equal to a number \"x\".", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor", 
        "usage": "Math.floor(x)\nParameters\n  x\n    A number."
    }, 
    "Math.fround": {
        "description": "The Math.fround() function returns the nearest single precision float representation of a number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround", 
        "usage": "Math.fround(x)\nParameters\n  x\n    A number."
    }, 
    "Math.hypot": {
        "description": "The Math.hypot() function returns the square root of the sum of squares of its arguments", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot", 
        "usage": "Math.hypot([value1[, value2[, ...]]])\nParameters\n  value1, value2, ...\n    Numbers."
    }, 
    "Math.imul": {
        "description": "The Math.imul() function returns the result of the C-like 32-bit multiplication of the two parameters.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul", 
        "usage": "Math.imul(a, b)\nParameters\n  a\n    First number.\n  b\n    Second number."
    }, 
    "Math.log": {
        "description": "The Math.log() function returns the natural logarithm (base e) of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log", 
        "usage": "Math.log(x)\nParameters\n  x\n    A number."
    }, 
    "Math.log10": {
        "description": "The Math.log10() function returns the base 10 logarithm of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10", 
        "usage": "Math.log10(x)\nParameters\n  x\n    A number."
    }, 
    "Math.log1p": {
        "description": "The Math.log1p() function returns the natural logarithm (base e) of 1 + a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p", 
        "usage": "Math.log1p(x)\nParameters\n  x\n    A number."
    }, 
    "Math.log2": {
        "description": "The Math.log2() function returns the base 2 logarithm of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2", 
        "usage": "Math.log2(x)\nParameters\n  x\n    A number."
    }, 
    "Math.max": {
        "description": "The Math.max() function returns the largest of zero or more numbers.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max", 
        "usage": "Math.max([value1[, value2[, ...]]])\nParameters\n  value1, value2, ...\n    Numbers."
    }, 
    "Math.min": {
        "description": "The Math.min() function returns the smallest of zero or more numbers.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min", 
        "usage": "Math.min([value1[, value2[, ...]]])\nParameters\n  value1, value2, ...\n    Numbers."
    }, 
    "Math.pow": {
        "description": "The Math.pow() function returns the base to the exponent Power", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow", 
        "usage": "Math.pow(base, exponent)\nParameters\n  base\n    The base number.\n  exponent\n    The exponent used to raise the base."
    }, 
    "Math.random": {
        "description": "The Math.random() function returns a floating-point, pseudo-random number in the range [0, 1) that is, from 0 (inclusive) up to but not including 1 (exclusive), which you can then scale to your desired range.  The implementation selects the initial seed to the random number generation algorithm; it cannot be chosen or reset by the user.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random", 
        "usage": "Math.random()"
    }, 
    "Math.round": {
        "description": "The Math.round() function returns the value of a number rounded to the nearest integer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round", 
        "usage": "Math.round(x)\nParameters\n  x\n    A number."
    }, 
    "Math.sign": {
        "description": "The Math.sign() function returns the sign of a number, indicating whether the number is positive, negative or zero.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign", 
        "usage": "Math.sign(x)\nParameters\n  x\n    A number."
    }, 
    "Math.sin": {
        "description": "The Math.sin() function returns the sine of a number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin", 
        "usage": "Math.sin(x)\nParameters\n  x\n    A number (given in radians)."
    }, 
    "Math.sinh": {
        "description": "The Math.sinh() function returns the hyperbolic sine of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh", 
        "usage": "Math.sinh(x)\nParameters\n  x\n    A number."
    }, 
    "Math.sqrt": {
        "description": "The Math.sqrt() function returns the square root of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt", 
        "usage": "Math.sqrt(x)\nParameters\n  x\n    A number."
    }, 
    "Math.tan": {
        "description": "The Math.tan() function returns the tangent of a number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan", 
        "usage": "Math.tan(x)\nParameters\n  x\n    A number representing an angle in radians."
    }, 
    "Math.tanh": {
        "description": "The Math.tanh() function returns the hyperbolic tangent of a number", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh", 
        "usage": "Math.tanh(x)\nParameters\n  x\n    A number."
    }, 
    "Math.trunc": {
        "description": "The Math.trunc() method returns the integral part of a number by removing any fractional digits.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc", 
        "usage": "Math.trunc(x)\nParameters\n  x\n    A number."
    }, 
    "NaN": {
        "description": "The global NaN property is a value representing Not-A-Number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN", 
        "usage": "NaN"
    }, 
    "Number": {
        "description": "The Number JavaScript object is a wrapper object allowing you to work with numerical values. A Number object is created using the Number() constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number", 
        "usage": "new Number(value);\nParameters\n  value\n    The numeric value of the object being created."
    }, 
    "Number.EPSILON": {
        "description": "The Number.EPSILON property represents the difference between one and the smallest value greater than one that can be represented as a Number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON"
    }, 
    "Number.MAX_SAFE_INTEGER": {
        "description": "The Number.MAX_SAFE_INTEGER constant represents the maximum safe integer in JavaScript (253 - 1).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER"
    }, 
    "Number.MAX_VALUE": {
        "description": "The Number.MAX_VALUE property represents the maximum numeric value representable in JavaScript.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE"
    }, 
    "Number.MIN_SAFE_INTEGER": {
        "description": "The Number.MIN_SAFE_INTEGER constant represents the minimum safe integer in JavaScript (-(253 - 1)).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER"
    }, 
    "Number.MIN_VALUE": {
        "description": "The Number.MIN_VALUE property represents the smallest positive numeric value representable in JavaScript.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE"
    }, 
    "Number.NEGATIVE_INFINITY": {
        "description": "The Number.NEGATIVE_INFINITY property represents the negative Infinity value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY"
    }, 
    "Number.NaN": {
        "description": "The Number.NaN property represents Not-A-Number. Equivalent of NaN.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN"
    }, 
    "Number.POSITIVE_INFINITY": {
        "description": "The Number.POSITIVE_INFINITY property represents the positive Infinity value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY"
    }, 
    "Number.isFinite": {
        "description": "The Number.isFinite() method determines whether the passed value is finite.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite", 
        "usage": "Number.isFinite(value)\nParameters\n  value\n    The value to be tested for finiteness."
    }, 
    "Number.isInteger": {
        "description": "The Number.isInteger() method determines whether the passed value is an integer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger", 
        "usage": "Number.isInteger(value)\nParameters\n  value\n    The value to be tested for being an integer."
    }, 
    "Number.isNaN": {
        "description": "The Number.isNaN() method determines whether the passed value is NaN. More robust version of the original global isNaN().", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN", 
        "usage": "Number.isNaN(value)\nParameters\n  value\n    The value to be tested for NaN."
    }, 
    "Number.isSafeInteger": {
        "description": "The Number.isSafeInteger() method determines whether the provided value is a number that is a safe integer. A safe integer is an integer that", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger", 
        "usage": "Number.isSafeInteger(testValue)\nParameters\n  testValue\n    The value to be tested for being a safe integer."
    }, 
    "Number.parseFloat": {
        "description": "The Number.parseFloat() method parses a string argument and returns a floating point number. This method behaves identically to the global function parseFloat() and is part of ECMAScript 6 (its purpose is modularization of globals).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat", 
        "usage": "Number.parseFloat(string)\nParameters\n  string\n    A string that represents the value you want to parse."
    }, 
    "Number.parseInt": {
        "description": "The Number.parseInt() method parses a string argument and returns an integer of the specified radix or base. This method behaves identically to the global function parseInt() and is part of ECMAScript 6 (its purpose is modularization of globals).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt", 
        "usage": "Number.parseInt(string[, radix])"
    }, 
    "Number.prototype": {
        "description": "The Number.prototype property represents the prototype for the Number constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/prototype"
    }, 
    "Number.prototype.toExponential": {
        "description": "The toExponential() method returns a string representing the Number object in exponential notation", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential", 
        "usage": "numObj.toExponential([fractionDigits])\nParameters\n  fractionDigits\n    Optional. An integer specifying the number of digits after the\n    decimal point. Defaults to as many digits as necessary to specify\n    the number.\nReturns\nA string representing a Number object in exponential notation with one digit before the decimal point, rounded to fractionDigits digits after the decimal point. If the fractionDigits argument is omitted, the number of digits after the decimal point defaults to the number of digits necessary to represent the value uniquely."
    }, 
    "Number.prototype.toFixed": {
        "description": "The toFixed() method formats a number using fixed-point notation.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed", 
        "usage": "numObj.toFixed([digits])\nParameters\n  digits\n    Optional. The number of digits to appear after the decimal point;\n    this may be a value between 0 and 20, inclusive, and\n    implementations may optionally support a larger range of values.\n    If this argument is omitted, it is treated as 0.\nReturns\nA string representation of numObj that does not use exponential notation and has exactly digits digits after the decimal place. The number is rounded if necessary, and the fractional part is padded with zeros if necessary so that it has the specified length. If numObj is greater than 1e+21, this method simply calls Number.prototype.toString() and returns a string in exponential notation."
    }, 
    "Number.prototype.toLocaleString": {
        "description": "The toLocaleString() method returns a string with a language sensitive representation of this number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString", 
        "usage": "numObj.toLocaleString([locales [, options]])"
    }, 
    "Number.prototype.toPrecision": {
        "description": "The toPrecision() method returns a string representing the Number object to the specified precision.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision", 
        "usage": "numObj.toPrecision([precision])\nParameters\n  precision\n    Optional. An integer specifying the number of significant digits.\nReturns\nA string representing a Number object in fixed-point or exponential notation rounded to precision significant digits. See the discussion of rounding in the description of the Number.prototype.toFixed() method, which also applies to toPrecision()."
    }, 
    "Number.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toSource", 
        "usage": "numObj.toSource()\nNumber.toSource()"
    }, 
    "Number.prototype.toString": {
        "description": "The toString() method returns a string representing the specified Number object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString", 
        "usage": "numObj.toString([radix])\nParameters\n  radix\n    Optional. An integer between 2 and 36 specifying the base to use\n    for representing numeric values."
    }, 
    "Number.prototype.valueOf": {
        "description": "The valueOf() method returns the primitive value of a Number object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/valueOf", 
        "usage": "numObj.valueOf()"
    }, 
    "Number.toInteger": {
        "description": "The Number.toInteger() method used to evaluate the passed value and convert it to an integer, but its implementation has been removed.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toInteger", 
        "usage": "Number.toInteger(number)\nParameters\n  number\n    The value to be converted to an integer."
    }, 
    "NumberFormat": {
        "description": "The Intl.NumberFormat object is a constructor for objects that enable language sensitive number formatting.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat", 
        "usage": "new Intl.NumberFormat([locales[, options]])\nIntl.NumberFormat.call(this[, locales[, options]])\n\nParameters\n  locales\n    Optional. A string with a BCP 47 language tag, or an array of such\n    strings. For the general form and interpretation of the locales\n    argument, see the Intl page. The following Unicode extension key\n    is allowed:  nu The numbering system to be used. Possible values\n    include: \"arab\", \"arabext\", \"bali\", \"beng\", \"deva\", \"fullwide\",\n    \"gujr\", \"guru\", \"hanidec\", \"khmr\", \"knda\", \"laoo\", \"latn\", \"limb\",\n    \"mlym\", \"mong\", \"mymr\", \"orya\", \"tamldec\", \"telu\", \"thai\", \"tibt\".\n  options\n    Optional. An object with some or all of the following properties:\n    localeMatcher The locale matching algorithm to use. Possible\n    values are \"lookup\" and \"best fit\"; the default is \"best fit\". For\n    information about this option, see the Intl page. style The\n    formatting style to use. Possible values are \"decimal\" for plain\n    number formatting, \"currency\" for currency formatting, and\n    \"percent\" for percent formatting; the default is \"decimal\".\n    currency The currency to use in currency formatting. Possible\n    values are the ISO 4217 currency codes, such as \"USD\" for the US\n    dollar, \"EUR\" for the euro, or \"CNY\" for the Chinese RMB  see the\n    Current currency & funds code list. There is no default value; if\n    the style is \"currency\", the currency property must be provided.\n    currencyDisplay How to display the currency in currency\n    formatting. Possible values are \"symbol\" to use a localized\n    currency symbol such as \u20ac, \"code\" to use the ISO currency code,\n    \"name\" to use a localized currency name such as \"dollar\"; the\n    default is \"symbol\". useGrouping Whether to use grouping\n    separators, such as thousands separators or thousand/lakh/crore\n    separators. Possible values are true and false; the default is\n    true.  The following properties fall into two groups:\n    minimumIntegerDigits, minimumFractionDigits, and\n    maximumFractionDigits in one group, minimumSignificantDigits and\n    maximumSignificantDigits in the other. If at least one property\n    from the second group is defined, then the first group is ignored.\n    minimumIntegerDigits The minimum number of integer digits to use.\n    Possible values are from 1 to 21; the default is 1.\n    minimumFractionDigits The minimum number of fraction digits to\n    use. Possible values are from 0 to 20; the default for plain\n    number and percent formatting is 0; the default for currency\n    formatting is the number of minor unit digits provided by the ISO\n    4217 currency code list (2 if the list doesn't provide that\n    information). maximumFractionDigits The maximum number of fraction\n    digits to use. Possible values are from 0 to 20; the default for\n    plain number formatting is the larger of minimumFractionDigits and\n    3; the default for currency formatting is the larger of\n    minimumFractionDigits and the number of minor unit digits provided\n    by the ISO 4217 currency code list (2 if the list doesn't provide\n    that information); the default for percent formatting is the\n    larger of minimumFractionDigits and 0. minimumSignificantDigits\n    The minimum number of significant digits to use. Possible values\n    are from 1 to 21; the default is 1. maximumSignificantDigits The\n    maximum number of significant digits to use. Possible values are\n    from 1 to 21; the default is minimumSignificantDigits."
    }, 
    "Object": {
        "description": "The Object constructor creates an object wrapper.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object", 
        "usage": "// Object initialiser or literal\n{ [ nameValuePair1[, nameValuePair2[, ...nameValuePairN] ] ] }\n\n// Called as a constructor\nnew Object([value])\nParameters\n  nameValuePair1, nameValuePair2, ... nameValuePairN\n    Pairs of names (strings) and values (any value) where the name is\n    separated from the value by a colon.\n  value\n    Any value."
    }, 
    "Object.assign": {
        "description": "The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign", 
        "usage": "Object.assign(target, ...sources)\nParameters\n  target\n    The target object.\n  sources\n    The source object(s).\nReturns\nThe target object gets returned."
    }, 
    "Object.create": {
        "description": "The Object.create() method creates a new object with the specified prototype object and properties.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create", 
        "usage": "Object.create(proto[, propertiesObject])\nParameters\n  proto\n    The object which should be the prototype of the newly-created\n    object.\n  propertiesObject\n    Optional. If specified and not undefined, an object whose\n    enumerable own properties (that is, those properties defined upon\n    itself and not enumerable properties along its prototype chain)\n    specify property descriptors to be added to the newly-created\n    object, with the corresponding property names. These properties\n    correspond to the second argument of Object.defineProperties()."
    }, 
    "Object.defineProperties": {
        "description": "The Object.defineProperties() method defines new or modifies existing properties directly on an object, returning the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties", 
        "usage": "Object.defineProperties(obj, props)\nParameters\n  obj\n    The object on which to define or modify properties.\n  props\n    An object whose own enumerable properties constitute descriptors\n    for the properties to be defined or modified. Properties have the\n    following optional keys:     configurable  true if and only if the\n    type of this property descriptor may be changed and if the\n    property may be deleted from the corresponding object. Defaults to\n    false.  enumerable  true if and only if this property shows up\n    during enumeration of the properties on the corresponding object.\n    Defaults to false.    value      The value associated with the\n    property. Can be any valid JavaScript value (number, object,\n    function, etc). Defaults to undefined.  writable  true if and only\n    if the value associated with the property may be changed with an\n    assignment operator. Defaults to false.    get      A function\n    which serves as a getter for the property, or undefined if there\n    is no getter. The function return will be used as the value of\n    property. Defaults to undefined.  set      A function which serves\n    as a setter for the property, or undefined if there is no setter.\n    The function will receive as only argument the new value being\n    assigned to the property. Defaults to undefined."
    }, 
    "Object.defineProperty": {
        "description": "The Object.defineProperty() method defines a new property directly on an object, or modifies an existing property on an object, and returns the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty", 
        "usage": "Object.defineProperty(obj, prop, descriptor)\nParameters\n  obj\n    The object on which to define the property.\n  prop\n    The name of the property to be defined or modified.\n  descriptor\n    The descriptor for the property being defined or modified."
    }, 
    "Object.freeze": {
        "description": "The Object.freeze() method freezes an object: that is, prevents new properties from being added to it; prevents existing properties from being removed; and prevents existing properties, or their enumerability, configurability, or writability, from being changed. In essence the object is made effectively immutable. The method returns the object being frozen.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze", 
        "usage": "Object.freeze(obj)\nParameters\n  obj\n    The object to freeze."
    }, 
    "Object.getOwnPropertyDescriptor": {
        "description": "The Object.getOwnPropertyDescriptor() method returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain) of a given object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor", 
        "usage": "Object.getOwnPropertyDescriptor(obj, prop)\nParameters\n  obj\n    The object in which to look for the property.\n  prop\n    The name of the property whose description is to be retrieved.\nReturns\nA property descriptor of the given property if it exists on the object, undefined otherwise."
    }, 
    "Object.getOwnPropertyNames": {
        "description": "The Object.getOwnPropertyNames() method returns an array of all properties (enumerable or not) found directly upon a given object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames", 
        "usage": "Object.getOwnPropertyNames(obj)\nParameters\n  obj\n    The object whose enumerable and non-enumerable own properties are\n    to be returned."
    }, 
    "Object.getOwnPropertySymbols": {
        "description": "The Object.getOwnPropertySymbols() method returns an array of all symbol properties found directly upon a given object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols", 
        "usage": "Object.getOwnPropertySymbols(obj)\nParameters\n  obj\n    The object whose symbol properties are to be returned."
    }, 
    "Object.getPrototypeOf": {
        "description": "The Object.getPrototypeOf() method returns the prototype (i.e. the value of the internal [[Prototype]] property) of the specified object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf", 
        "usage": "Object.getPrototypeOf(obj)\nParameters\n  obj\n    The object whose prototype is to be returned."
    }, 
    "Object.is": {
        "description": "The Object.is() method determines whether two values are the same value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is", 
        "usage": "var isSame = Object.is(value1, value2);\nParameters\n  value1\n    The first value to compare.\n  value2\n    The second value to compare."
    }, 
    "Object.isExtensible": {
        "description": "The Object.isExtensible() method determines if an object is extensible (whether it can have new properties added to it).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible", 
        "usage": "Object.isExtensible(obj)\nParameters\n  obj\n    The object which should be checked."
    }, 
    "Object.isFrozen": {
        "description": "The Object.isFrozen() determines if an object is frozen.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen", 
        "usage": "Object.isFrozen(obj)\nParameters\n  obj\n    The object which should be checked."
    }, 
    "Object.isSealed": {
        "description": "The Object.isSealed() method determines if an object is sealed.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed", 
        "usage": "Object.isSealed(obj)\nParameters\n  obj\n    The object which should be checked."
    }, 
    "Object.keys": {
        "description": "The Object.keys() method returns an array of a given object's own enumerable properties, in the same order as that provided by a for...in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys", 
        "usage": "Object.keys(obj)\nParameters\n  obj\n    The object whose enumerable own properties are to be returned."
    }, 
    "Object.observe": {
        "description": "The Object.observe() method is used for asynchronously observing the changes to an object. It provides a stream of changes in the order in which they occur.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe", 
        "usage": "Object.observe(obj, callback)\nParameters\n  obj\n    The object to be observed.\n  callback\n    The function called each time changes are made, with the following\n    argument:     changes      An array of objects each representing a\n    change. The properties of these change objects are:      name: The\n    name of the property which was changed. object: The changed object\n    after the change was made. type: A string indicating the type of\n    change taking place. One of \"add\", \"update\", or \"delete\".\n    oldValue: Only for \"update\" and \"delete\" types. The value before\n    the change."
    }, 
    "Object.preventExtensions": {
        "description": "The Object.preventExtensions() method prevents new properties from ever being added to an object (i.e. prevents future extensions to the object).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions", 
        "usage": "Object.preventExtensions(obj)\nParameters\n  obj\n    The object which should be made non-extensible."
    }, 
    "Object.prototype": {
        "description": "The Object.prototype property represents the Object prototype object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype"
    }, 
    "Object.prototype.__count__": {
        "description": "The __count__ property used to store the count of enumerable properties on the object, but it has been removed.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/count"
    }, 
    "Object.prototype.__defineGetter__": {
        "description": "The __defineGetter__ method binds an object's property to a function to be called when that property is looked up.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineGetter__", 
        "usage": "obj.__defineGetter__(prop, func)\nParameters\n  prop\n    A string containing the name of the property to bind to the given\n    function.\n  func\n    A function to be bound to a lookup of the specified property."
    }, 
    "Object.prototype.__defineSetter__": {
        "description": "The __defineSetter__ method binds an object's property to a function to be called when an attempt is made to set that property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineSetter__", 
        "usage": "obj.__defineSetter__(prop, fun)\nParameters\n  prop\n    A string containing the name of the property to be bound to the\n    given function.\n  fun\n    A function to be called when there is an attempt to set the\n    specified property. This function takes the form   function(val) {\n    . . . }   val      An alias for the variable that holds the value\n    attempted to be assigned to prop."
    }, 
    "Object.prototype.__lookupGetter__": {
        "description": "The __lookupGetter__ method returns the function bound as a getter to the specified property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__lookupGetter__", 
        "usage": "obj.__lookupGetter__(sprop)\nParameters\n  sprop\n    A string containing the name of the property whose getter should\n    be returned."
    }, 
    "Object.prototype.__lookupSetter__": {
        "description": "The __lookupSetter__ method returns the function bound as a setter to the specified property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__lookupSetter__", 
        "usage": "obj.__lookupSetter__(sprop)\nParameters\n  sprop\n    A string containing the name of the property whose setter should\n    be returned."
    }, 
    "Object.prototype.__noSuchMethod__": {
        "description": "The __noSuchMethod__ property references a function to be executed when a non-existent method is called on an object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/noSuchMethod"
    }, 
    "Object.prototype.__parent__": {
        "description": "The __parent__ property used to point to an object's context, but it has been removed.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/Parent"
    }, 
    "Object.prototype.__proto__": {
        "description": "The __proto__ property of Object.prototype is an accessor property (a getter function and a setter function) that exposes the internal [[Prototype]] (either an object or null) of the object through which it is accessed.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto"
    }, 
    "Object.prototype.constructor": {
        "description": "Returns a reference to the Object function that created the instance's prototype. Note that the value of this property is a reference to the function itself, not a string containing the function's name. The value is only read-only for primitive values such as 1,true and \"test\".", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor", 
        "usage": "Returns a reference to the Object function that created the instance's prototype. Note that the value of this property is a reference to the function itself, not a string containing the function's name. The value is only read-only for primitive values such as 1, true and \"test\"."
    }, 
    "Object.prototype.eval": {
        "description": "The Object.eval() method used to evaluate a string of JavaScript code in the context of an object, however, this method has been removed.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/eval", 
        "usage": "obj.eval(string)\nParameters\n  string\n    Any string representing a JavaScript expression, statement, or\n    sequence of statements. The expression can include variables and\n    properties of existing objects."
    }, 
    "Object.prototype.hasOwnProperty": {
        "description": "The hasOwnProperty() method returns a boolean indicating whether the object has the specified property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty", 
        "usage": "obj.hasOwnProperty(prop)\nParameters\n  prop\n    The name of the property to test."
    }, 
    "Object.prototype.isPrototypeOf": {
        "description": "The isPrototypeOf() method tests for an object in another object's prototype chain.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf", 
        "usage": "prototypeObj.isPrototypeOf(obj)\nParameters\n  prototypeObj\n    An object to be tested against each link in the prototype chain of\n    the object argument.\n  object\n    The object whose prototype chain will be searched."
    }, 
    "Object.prototype.propertyIsEnumerable": {
        "description": "The propertyIsEnumerable() method returns a Boolean indicating whether the specified property is enumerable.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable", 
        "usage": "obj.propertyIsEnumerable(prop)\nParameters\n  prop\n    The name of the property to test."
    }, 
    "Object.prototype.toLocaleString": {
        "description": "The toLocaleString() method returns a string representing the object. This method is meant to be overriden by derived objects for locale-specific purposes.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString", 
        "usage": "obj.toLocaleString();"
    }, 
    "Object.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toSource", 
        "usage": "Object.toSource();\nobj.toSource();\n"
    }, 
    "Object.prototype.toString": {
        "description": "The toString() method returns a string representing object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString", 
        "usage": "obj.toString()"
    }, 
    "Object.prototype.unwatch": {
        "description": "The unwatch() method removes a watchpoint set with the watch() method.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/unwatch", 
        "usage": "obj.unwatch(prop)\nParameters\n  prop\n    The name of a property of the object to stop watching."
    }, 
    "Object.prototype.valueOf": {
        "description": "The valueOf() method returns the primitive value of the specified object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf", 
        "usage": "object.valueOf()"
    }, 
    "Object.prototype.watch": {
        "description": "The watch() method watches for a property to be assigned a value and runs a function when that occurs.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch", 
        "usage": "obj.watch(prop, handler)\nParameters\n  prop\n    The name of a property of the object on which you wish to monitor\n    changes.\n  handler\n    A function to call when the specified property's value changes."
    }, 
    "Object.seal": {
        "description": "The Object.seal() method seals an object, preventing new properties from being added to it and marking all existing properties as non-configurable. Values of present properties can still be changed as long as they are writable.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal", 
        "usage": "Object.seal(obj)\nParameters\n  obj\n    The object which should be sealed."
    }, 
    "Object.setPrototypeOf": {
        "description": "The Object.setPrototype() method sets the prototype (i.e., the internal [[Prototype]] property) of a specified object to another object or null.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf", 
        "usage": "Object.setPrototypeOf(obj, prototype);\nParameters\n  obj\n    The object which is to have its prototype set.\n  prototype\n    The object's new prototype (an object or null)."
    }, 
    "ParallelArray": {
        "description": "The goal of ParallelArray was to enable data-parallelism in web applications. The higher-order functions available on ParallelArray attempted to execute in parallel, though they may fall back to sequential execution if necessary. To ensure that your code executes in parallel, it is suggested that the functions should be limited to the parallelizable subset of JS that Firefox supports.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ParallelArray", 
        "usage": "new ParallelArray()\nnew ParallelArray([element0, element1, ...])\nnew ParallelArray(arrayLength, elementalFunction)"
    }, 
    "Promise": {
        "description": "The Promise object is used for deferred and asynchronous computations. A Promise is in one of these states: pending (initial state, not fulfilled or rejected), fulfilled (successful operation), rejected (failed operation). A Promise is said to be settled if the Promise is either fulfilled or rejected, but not pending.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise", 
        "usage": "new Promise(executor);\nnew Promise(function(resolve, reject) { ... });\nParameters\n  executor\n    Function object with two arguments resolve and reject. The first\n    argument fulfills the promise, the second argument rejects it. We\n    can call these functions, once our operation is completed."
    }, 
    "Promise.all": {
        "description": "The Promise.all(iterable) method returns a promise that resolves when all of the promises in the iterable argument have resolved.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all", 
        "usage": "Promise.all(iterable);\nParameters\n  iterable\n    An iterable object, such as an Array. See iterable."
    }, 
    "Promise.prototype": {
        "description": "The Promise.prototype property represents the prototype for the Promise constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/prototype"
    }, 
    "Promise.prototype.catch": {
        "description": "The catch() method returns a Promise and deals with rejected cases only. It behaves the same as calling Promise.prototype.then(undefined, onRejected).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch", 
        "usage": "p.catch(onRejected);\n\np.catch(function(reason) {\n   // rejection\n});\n\nParameters\n  onRejected\n    A Function called when the Promise is rejected. This function has\n    one argument, the rejection reason."
    }, 
    "Promise.prototype.then": {
        "description": "The then() method returns a Promise. It takes two arguments, both are callback functions for the success and failure cases of the Promise.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then", 
        "usage": "p.then(onFulfilled, onRejected);\n\np.then(function(value) {\n   // fulfillment\n  }, function(reason) {\n  // rejection\n});\n\nParameters\n  onFulfilled\n    A Function called when the Promise is fulfilled. This function has\n    one argument, the fulfillment value.\n  onRejected\n    A Function called when the Promise is rejected. This function has\n    one argument, the rejection reason."
    }, 
    "Promise.race": {
        "description": "The Promise.race(iterable) method returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race", 
        "usage": "Promise.race(iterable);\nParameters\n  iterable\n    An iterable object, such as an Array. See iterable."
    }, 
    "Promise.reject": {
        "description": "The Promise.reject(reason) method returns a Promise object that is rejected with the given reason.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject", 
        "usage": "Promise.reject(reason);\nParameters\n  reason\n    Reason why this Promise rejected."
    }, 
    "Promise.resolve": {
        "description": "The Promise.resolve(value) method returns a Promise object that is resolved with the given value. If the value is a thenable (i.e. has a then method), the returned promise will \"follow\" that thenable, adopting its eventual state; otherwise the returned promise will be fulfilled with the value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve", 
        "usage": "Promise.resolve(value);\nPromise.resolve(promise);\nPromise.resolve(thenable);\n\nParameters\n  value\n    Argument to be resolved by this Promise. Can also be a Promise or\n    a thenable to resolve."
    }, 
    "Proxy": {
        "description": "The Proxy object is used to define custom behavior for fundamental operations (e.g. property lookup, assignment, enumeration, function invocation, etc).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy", 
        "usage": "var p = new Proxy(target, handler);\n\nParameters\n  target\n    A target object (can be any sort of objects, including a native\n    array, a function or even another proxy) or function to wrap with\n    Proxy.\n  handler\n    An object whose properties are functions which define the behavior\n    of the proxy when an operation is performed on it."
    }, 
    "Proxy.revocable": {
        "description": "The Proxy.revocable() method is used to create a revocable Proxy object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable", 
        "usage": "Proxy.revocable(target, handler);\n\nReturns\nA newly created revocable Proxy object is returned."
    }, 
    "RangeError": {
        "description": "The RangeError object indicates an error when a value is not in the set or range of allowed values.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError", 
        "usage": "new RangeError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "ReferenceError": {
        "description": "The ReferenceError object represents an error when a non-existent variable is referenced.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError", 
        "usage": "new ReferenceError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "Reflect": {
        "description": "Reflect is a built-in object that provides methods for interceptable JavaScript operations. The methods are the same as those of the proxy handlers. Reflect It is not a function object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect"
    }, 
    "RegExp": {
        "description": "The RegExp constructor creates a regular expression object for matching text with a pattern.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp", 
        "usage": "/pattern/flags\nnew RegExp(pattern[, flags])\n\nParameters\n  pattern\n    The text of the regular expression.\n  flags\n    If specified, flags can have any combination of the following\n    values:  g global match i ignore case m multiline; treat beginning\n    and end characters (^ and $) as working over multiple lines (i.e.,\n    match the beginning or end of each line (delimited by \\n or \\r),\n    not only the very beginning or end of the whole input string) y\n    sticky; matches only from the index indicated by the lastIndex\n    property of this regular expression in the target string (and does\n    not attempt to match from any later indexes)."
    }, 
    "RegExp.$1-$9": {
        "description": "The non-standard $1, $2, $3, $4, $5, $6, $7, $8, $9 properties are static and read-only properties of regular expressions that contain parenthesized substring matches.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n"
    }, 
    "RegExp.input ($_)": {
        "description": "The non-standard input property is a static property of regular expressions that contains the string against which a regular expression is matched. RegExp.$_ is an alias for this property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/input"
    }, 
    "RegExp.lastIndex": {
        "description": "The lastIndex is a read/write integer property of regular expressions that specifies the index at which to start the next match.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex"
    }, 
    "RegExp.lastMatch ($&)": {
        "description": "The non-standard lastMatch property is a static and read-only property of regular expressions that contains the last matched characters. RegExp.$& is an alias for this property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastMatch"
    }, 
    "RegExp.lastParen ($+)": {
        "description": "The non-standard lastParen property is a static and read-only property of regular expressions that contains the last parenthesized substring match, if any. RegExp.$+ is an alias for this property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastParen"
    }, 
    "RegExp.leftContext ($`)": {
        "description": "The non-standard leftContext property is a static and read-only property of regular expressions that contains the substring preceding the most recent match. RegExp.$` is an alias for this property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/leftContext"
    }, 
    "RegExp.prototype": {
        "description": "The RegExp.prototype property represents the prototype object for the RegExp constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/prototype"
    }, 
    "RegExp.prototype.compile": {
        "description": "The deprecated compile() method is used to (re-)compile a regular expression during execution of a script. It is basically the same as the RegExp constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/compile", 
        "usage": "regexObj.compile(pattern, flags)\nParameters\n  pattern\n    The text of the regular expression.\n  flags\n    If specified, flags can have any combination of the following\n    values:  g global match i ignore case m multiline; treat beginning\n    and end characters (^ and $) as working over multiple lines (i.e.,\n    match the beginning or end of each line (delimited by \\n or \\r),\n    not only the very beginning or end of the whole input string) y\n    sticky; matches only from the index indicated by the lastIndex\n    property of this regular expression in the target string (and does\n    not attempt to match from any later indexes)."
    }, 
    "RegExp.prototype.exec": {
        "description": "The exec() method executes a search for a match in a specified string. Returns a result array, or null.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec", 
        "usage": "regexObj.exec(str)\nParameters\n  str\n    The string against which to match the regular expression.\nReturns\nIf the match succeeds, the exec() method returns an array and updates properties of the regular expression object. The returned array has the matched text as the first item, and then one item for each capturing parenthesis that matched containing the text that was captured."
    }, 
    "RegExp.prototype.flags": {
        "description": "The flags property returns a string consisting of the flags of the current regular expression object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags"
    }, 
    "RegExp.prototype.global": {
        "description": "The global property indicates whether or not the \"g\" flag is used with the regular expression. global is a read-only property of an individual regular expression instance.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global"
    }, 
    "RegExp.prototype.ignoreCase": {
        "description": "The ignoreCase property indicates whether or not the \"i\" flag is used with the regular expression. ignoreCase is a read-only property of an individual regular expression instance.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase"
    }, 
    "RegExp.prototype.multiline": {
        "description": "The multiline property indicates whether or not the \"m\" flag is used with the regular expression. multiline is a read-only property of an individual regular expression instance.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline"
    }, 
    "RegExp.prototype.source": {
        "description": "The source property returns a String containing the source text of the regexp object, and it doesn't contain the two forward slashes on both sides and any flags.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/source", 
        "usage": "The source property returns a String containing the source text of the regexp object, and it doesn't contain the two forward slashes on both sides and any flags."
    }, 
    "RegExp.prototype.sticky": {
        "description": "The sticky property reflects whether or not the search is sticky (searches in strings only from the index indicated by the lastIndex property of this regular expression). sticky is a read-only property of an individual regular expression object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky"
    }, 
    "RegExp.prototype.test": {
        "description": "The test() method executes a search for a match between a regular expression and a specified string. Returns true or false.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test", 
        "usage": "regexObj.test(str)\nParameters\n  str\n    The string against which to match the regular expression.\nReturns\nBoolean. true or false."
    }, 
    "RegExp.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/toSource", 
        "usage": "regexObj.toSource()\nRegExp.toSource()\n"
    }, 
    "RegExp.prototype.toString": {
        "description": "The toString() method returns a string representing the regular expression.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/toString", 
        "usage": "regexObj.toString();"
    }, 
    "RegExp.prototype.unicode": {
        "description": "The unicode property indicates whether or not the \"u\" flag is used with the regular expression. unicode is a read-only property of an individual regular expression instance.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode"
    }, 
    "RegExp.rightContext ($')": {
        "description": "The non-standard rightContext property is a static and read-only property of regular expressions that contains the substring following the most recent match. RegExp.$' is an alias for this property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/rightContext"
    }, 
    "Set": {
        "description": "The Set object lets you store unique values of any type, whether primitive values or object references.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", 
        "usage": "new Set([iterable]);\nParameters\n  iterable\n    If an iterable object is passed, all of its elements will be added\n    to the new Set. null is treated as undefined."
    }, 
    "Set.prototype": {
        "description": "The Set.prototype property represents the prototype for the Set constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/prototype"
    }, 
    "Set.prototype.add": {
        "description": "The add() method appends a new element with a specified value to the end of a Set object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add", 
        "usage": "mySet.add(value);\nParameters\n  value\n    Required. The value of the element to add to the Set object.\nReturns\nThe Set object."
    }, 
    "Set.prototype.clear": {
        "description": "The clear() method removes all elements from a Set object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/clear", 
        "usage": "mySet.clear();"
    }, 
    "Set.prototype.delete": {
        "description": "The delete() method removes the specified element from a Set object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete", 
        "usage": "mySet.delete(value);\nParameters\n  value\n    Required. The value of the element to remove from the Set object.\nReturns\nReturns true if an element in the Set object has been removed successfully; otherwise false."
    }, 
    "Set.prototype.entries": {
        "description": "The entries() method returns a new Iterator object that contains an array of [value, value] for each element in the Set object, in insertion order. For Set objects there is no key like in Map objects. However, to keep the API similar to the Map object, each entry has the same value for its key and value here, so that an array [value, value] is returned.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries", 
        "usage": "mySet.entries()"
    }, 
    "Set.prototype.forEach": {
        "description": "The forEach() method executes a provided function once per each value in the Set object, in insertion order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/forEach", 
        "usage": "mySet.forEach(callback[, thisArg])\nParameters\n  callback\n    Function to execute for each element.\n  thisArg\n    Value to use as this when executing callback."
    }, 
    "Set.prototype.has": {
        "description": "The has() method returns a boolean indicating whether an element with the specified value exists in a Set object or not.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has", 
        "usage": "mySet.has(value);\nParameters\n  value\n    Required. The value to test for presence in the Set object."
    }, 
    "Set.prototype.size": {
        "description": "The size accessor property returns the number of elements in a Set object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/size"
    }, 
    "Set.prototype.values": {
        "description": "The values() method returns a new Iterator object that contains the values for each element in the Set object in insertion order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values", 
        "usage": "mySet.values();\nmySet.keys();\n"
    }, 
    "Set.prototype[@@iterator]": {
        "description": "The initial value of the @@iterator property is the same function object as the initial value of the values property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/@@iterator", 
        "usage": "mySet[Symbol.iterator]"
    }, 
    "StopIteration": {
        "description": "The StopIteration object is used to tell the end of the iteration in the legacy iterator protocol.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/StopIteration", 
        "usage": "StopIteration"
    }, 
    "String": {
        "description": "The String global object is a constructor for strings, or a sequence of characters.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String", 
        "usage": "'string text'\n\"string text\"\n\nParameters\n  thing\n    Anything to be converted to a string."
    }, 
    "String.fromCharCode": {
        "description": "The static String.fromCharCode() method returns a string created by using the specified sequence of Unicode values.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode", 
        "usage": "String.fromCharCode(num1[, ...[, numN]])\nParameters\n  num1, ..., numN\n    A sequence of numbers that are Unicode values."
    }, 
    "String.fromCodePoint": {
        "description": "The static String.fromCodePoint() method returns a string created by using the specified sequence of code points.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint", 
        "usage": "String.fromCodePoint(num1[, ...[, numN]])\nParameters\n  num1, ..., numN\n    A sequence of code points."
    }, 
    "String.length": {
        "description": "The length property represents the length of a string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length"
    }, 
    "String.prototype": {
        "description": "The String.prototype property represents the String prototype object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/prototype"
    }, 
    "String.prototype.anchor": {
        "description": "The anchor() method creates an <a> HTML anchor element that is used as a hypertext target.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/anchor", 
        "usage": "str.anchor(name)\nParameters\n  name\n    A string representing the name attribute of the a tag to be\n    created."
    }, 
    "String.prototype.big": {
        "description": "The big() method creates a <big> HTML element that causes a string to be displayed in a big font.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/big", 
        "usage": "str.big()"
    }, 
    "String.prototype.blink": {
        "description": "The blink() method creates a <blink> HTML element that causes a string to blink.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/blink", 
        "usage": "str.blink()"
    }, 
    "String.prototype.bold": {
        "description": "The bold() method creates a <b> HTML element that causes a string to be displayed as bold.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/bold", 
        "usage": "str.bold()"
    }, 
    "String.prototype.charAt": {
        "description": "The charAt() method returns the specified character from a string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt", 
        "usage": "str.charAt(index)\nParameters\n  index\n    An integer between 0 and 1-less-than the length of the string."
    }, 
    "String.prototype.charCodeAt": {
        "description": "The charCodeAt() method returns the numeric Unicode value of the character at the given index (except for unicode codepoints > 0x10000).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt", 
        "usage": "str.charCodeAt(index)\nParameters\n  index\n    An integer greater than or equal to 0 and less than the length of\n    the string; if it is not a number, it defaults to 0."
    }, 
    "String.prototype.codePointAt": {
        "description": "The codePointAt() method returns a non-negative integer that is the UTF-16 encoded code point value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt", 
        "usage": "str.codePointAt(pos)\nParameters\n  pos\n    Position of an element in the String to return the code point\n    value from."
    }, 
    "String.prototype.concat": {
        "description": "The concat() method combines the text of two or more strings and returns a new string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat", 
        "usage": "str.concat(string2, string3[, ..., stringN])\nParameters\n  string2...stringN\n    Strings to concatenate to this string."
    }, 
    "String.prototype.endsWith": {
        "description": "The endsWith() method determines whether a string ends with the characters of another string, returning true or false as appropriate.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith", 
        "usage": "str.endsWith(searchString[, position])\nParameters\n  searchString\n    The characters to be searched for at the end of this string.\n  position\n    Optional. Search within this string as if this string were only\n    this long; defaults to this string's actual length, clamped within\n    the range established by this string's length."
    }, 
    "String.prototype.fixed": {
        "description": "The fixed() method creates a <tt> HTML element that causes a string to be displayed in fixed-pitch font.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fixed", 
        "usage": "str.fixed()"
    }, 
    "String.prototype.fontcolor": {
        "description": "The fontcolor() method creates a <font> HTML element that causes a string to be displayed in the specified font color.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fontcolor", 
        "usage": "str.fontcolor(color)\nParameters\n  color\n    A string expressing the color as a hexadecimal RGB triplet or as a\n    string literal. String literals for color names are listed in the\n    CSS color reference."
    }, 
    "String.prototype.fontsize": {
        "description": "The fontsize() method creates a <font> HTML element that causes a string to be displayed in the specified font size.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fontsize", 
        "usage": "str.fontsize(size)\nParameters\n  size\n    An integer between 1 and 7, a string representing a signed integer\n    between 1 and 7."
    }, 
    "String.prototype.includes": {
        "description": "The includes() method determines whether one string may be found within another string, returning true or false as appropriate.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes", 
        "usage": "str.includes(searchString[, position])\nParameters\n  searchString\n    A string to be searched for within this string.\n  position\n    Optional. The position in this string at which to begin searching\n    for searchString; defaults to 0."
    }, 
    "String.prototype.indexOf": {
        "description": "The indexOf() method returns the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf", 
        "usage": "str.indexOf(searchValue[, fromIndex])\nParameters\n  searchValue\n    A string representing the value to search for.\n  fromIndex\n    Optional. The location within the calling string to start the\n    search from. It can be any integer. The default value is 0. If\n    fromIndex < 0 the entire string is searched (same as passing 0).\n    If fromIndex >= str.length, the method will return -1 unless\n    searchValue is an empty string in which case str.length is\n    returned."
    }, 
    "String.prototype.italics": {
        "description": "The italics() method creates an <i> HTML element that causes a string to be italic.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/italics", 
        "usage": "str.italics()"
    }, 
    "String.prototype.lastIndexOf": {
        "description": "The lastIndexOf() method returns the index within the calling String object of the last occurrence of the specified value, or -1 if not found. The calling string is searched backward, starting at fromIndex.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf", 
        "usage": "str.lastIndexOf(searchValue[, fromIndex])\nParameters\n  searchValue\n    A string representing the value to search for.\n  fromIndex\n    Optional. The location within the calling string to start the\n    search at, indexed from left to right. It can be any integer. The\n    default value is str.length. If it is negative, it is treated as\n    0. If fromIndex > str.length, fromIndex is treated as str.length."
    }, 
    "String.prototype.link": {
        "description": "The link() method creates an <a> HTML element that causes a string to be displayed as a hypertext link to another URL.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/link", 
        "usage": "str.link(url)\nParameters\n  url\n    Any string that specifies the href attribute of the <a> tag; it\n    should be a valid URL (relative or absolute), with any &\n    characters escaped as &amp;, and any \" characters escaped as\n    &quot;."
    }, 
    "String.prototype.localeCompare": {
        "description": "The localeCompare() method returns a number indicating whether a reference string comes before or after or is the same as the given string in sort order.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare", 
        "usage": "str.localeCompare(compareString[, locales[, options]])\nParameters\n  compareString\n    The string against which the referring string is comparing"
    }, 
    "String.prototype.match": {
        "description": "The match() method retrieves the matches when matching a string against a regular expression.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match", 
        "usage": "str.match(regexp)\nParameters\n  regexp\n    A regular expression object. If a non-RegExp object obj is passed,\n    it is implicitly converted to a RegExp by using new RegExp(obj)."
    }, 
    "String.prototype.normalize": {
        "description": "The normalize() method returns the Unicode Normalization Form of a given string (if the value isn't a string, it will be converted to one first).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize", 
        "usage": "str.normalize([form])\nParameters\n  form\n    One of \"NFC\", \"NFD\", \"NFKC\", or \"NFKD\", specifying the Unicode\n    Normalization Form. If omitted or undefined, \"NFC\" is used.    NFC\n     Normalization Form Canonical Composition. NFD  Normalization\n    Form Canonical Decomposition. NFKC  Normalization Form\n    Compatibility Composition. NFKD  Normalization Form Compatibility\n    Decomposition."
    }, 
    "String.prototype.quote": {
        "description": "The non-standard quote() method returns a copy of the string, replacing various special characters in the string with their escape sequences and wrapping the result in double-quotes (\").", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/quote", 
        "usage": "str.quote()"
    }, 
    "String.prototype.repeat": {
        "description": "The repeat() method constructs and returns a new string which contains the specified number of copies of the string on which it was called, concatenated together.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat", 
        "usage": "str.repeat(count)\nParameters\n  count\n    A finite integer, indicating the number of times to repeat the\n    string in the newly-created string that is to be returned."
    }, 
    "String.prototype.replace": {
        "description": "The replace() method returns a new string with some or all matches of a pattern replaced by a replacement. The pattern can be a string or a RegExp, and the replacement can be a string or a function to be called for each match.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace", 
        "usage": "str.replace(regexp|substr, newSubStr|function[, flags])\nParameters\n  regexp\n    A RegExp object. The match is replaced by the return value of\n    parameter #2.\n  substr\n    A String that is to be replaced by newSubStr.\n  newSubStr\n    The String that replaces the substring received from parameter #1.\n    A number of special replacement patterns are supported; see the\n    \"Specifying a string as a parameter\" section below.\n  function\n    A function to be invoked to create the new substring (to put in\n    place of the substring received from parameter #1). The arguments\n    supplied to this function are described in the \"Specifying a\n    function as a parameter\" section below.\n  flags\n    Note: The flags argument does not work in v8 Core (Chrome and\n    Node.js). A string specifying a combination of regular expression\n    flags. The use of the flags parameter in the\n    String.prototype.replace() method is non-standard. Instead of\n    using this parameter, use a RegExp object with the corresponding\n    flags. The value of this parameter if it is used should be a\n    string consisting of one or more of the following characters to\n    affect the operation as described:  g global match i ignore case m\n    match over multiple lines y   sticky\nReturns\nA new string with some or all matches of a pattern replaced by a replacement."
    }, 
    "String.prototype.search": {
        "description": "The search() method executes a search for a match between a regular expression and this String object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search", 
        "usage": "str.search([regexp])\nParameters\n  regexp\n    Optional. A regular expression object. If a non-RegExp object obj\n    is passed, it is implicitly converted to a RegExp by using new\n    RegExp(obj)."
    }, 
    "String.prototype.slice": {
        "description": "The slice() method extracts a section of a string and returns a new string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice", 
        "usage": "str.slice(beginSlice[, endSlice])\nParameters\n  beginSlice\n    The zero-based index at which to begin extraction. If negative, it\n    is treated as sourceLength + beginSlice where sourceLength is the\n    length of the string (for example, if beginSlice is -3 it is\n    treated as sourceLength - 3).\n  endSlice\n    Optional. The zero-based index at which to end extraction. If\n    omitted, slice() extracts to the end of the string. If negative,\n    it is treated as sourceLength - endSlice where sourceLength is the\n    length of the string."
    }, 
    "String.prototype.small": {
        "description": "The small() method creates a <small> HTML element that causes a string to be displayed in a small font.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/small", 
        "usage": "str.small()"
    }, 
    "String.prototype.split": {
        "description": "The split() method splits a String object into an array of strings by separating the string into substrings.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split", 
        "usage": "str.split([separator[, limit]])\nParameters\n  separator\n    Optional. Specifies the character(s) to use for separating the\n    string. The separator is treated as a string or a regular\n    expression. If separator is omitted, the array returned contains\n    one element consisting of the entire string. If separator is an\n    empty string, str is converted to an array of characters.\n  limit\n    Optional. Integer specifying a limit on the number of splits to be\n    found. The split() method still splits on every match of\n    separator, but it truncates the returned array to at most limit\n    elements."
    }, 
    "String.prototype.startsWith": {
        "description": "The startsWith() method determines whether a string begins with the characters of another string, returning true or false as appropriate.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith", 
        "usage": "str.startsWith(searchString[, position])\nParameters\n  searchString\n    The characters to be searched for at the start of this string.\n  position\n    Optional. The position in this string at which to begin searching\n    for searchString; defaults to 0."
    }, 
    "String.prototype.strike": {
        "description": "The strike() method creates a <strike> HTML element that causes a string to be displayed as struck-out text.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/strike", 
        "usage": "str.strike()"
    }, 
    "String.prototype.sub": {
        "description": "The sub() method creates a <sub> HTML element that causes a string to be displayed as subscript.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/sub", 
        "usage": "str.sub()"
    }, 
    "String.prototype.substr": {
        "description": "The substr() method returns the characters in a string beginning at the specified location through the specified number of characters.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr", 
        "usage": "str.substr(start[, length])\nParameters\n  start\n    Location at which to begin extracting characters. If a negative\n    number is given, it is treated as strLength + start where\n    strLength = to the length of the string (for example, if start is\n    -3 it is treated as strLength - 3.)\n  length\n    Optional. The number of characters to extract."
    }, 
    "String.prototype.substring": {
        "description": "The substring() method returns a subset of a string between one index and another, or through the end of the string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring", 
        "usage": "str.substring(indexA[, indexB])\nParameters\n  indexA\n    An integer between 0 and the length of the string, specifying the\n    offset into the string of the first character to include in the\n    returned substring.\n  indexB\n    Optional. An integer between 0 and the length of the string, which\n    specifies the offset into the string of the first character not to\n    include in the returned substring."
    }, 
    "String.prototype.sup": {
        "description": "The sup() method creates a <sup> HTML element that causes a string to be displayed as superscript.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/sup", 
        "usage": "str.sup()"
    }, 
    "String.prototype.toLocaleLowerCase": {
        "description": "The toLocaleLowerCase() method returns the calling string value converted to lower case, according to any locale-specific case mappings.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase", 
        "usage": "str.toLocaleLowerCase()"
    }, 
    "String.prototype.toLocaleUpperCase": {
        "description": "The toLocaleUpperCase() method returns the calling string value converted to upper case, according to any locale-specific case mappings.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase", 
        "usage": "str.toLocaleUpperCase()"
    }, 
    "String.prototype.toLowerCase": {
        "description": "The toLowerCase() method returns the calling string value converted to lowercase.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase", 
        "usage": "str.toLowerCase()"
    }, 
    "String.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toSource", 
        "usage": "String.toSource()\nstr.toSource()\n"
    }, 
    "String.prototype.toString": {
        "description": "The toString() method returns a string representing the specified object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toString", 
        "usage": "str.toString()"
    }, 
    "String.prototype.toUpperCase": {
        "description": "The toUpperCase() method returns the calling string value converted to uppercase.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase", 
        "usage": "str.toUpperCase()"
    }, 
    "String.prototype.trim": {
        "description": "The trim() method removes whitespace from both ends of a string. Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) and all the line terminator characters (LF, CR, etc.).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim", 
        "usage": "str.trim()"
    }, 
    "String.prototype.trimLeft": {
        "description": "The trimLeft() removes whitespace from the left end of the string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/TrimLeft", 
        "usage": "str.trimLeft()"
    }, 
    "String.prototype.trimRight": {
        "description": "The trimRight() method removes whitespace from the right end of the string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/TrimRight", 
        "usage": "str.trimRight()"
    }, 
    "String.prototype.valueOf": {
        "description": "The valueOf() method returns the primitive value of a String object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/valueOf", 
        "usage": "str.valueOf()"
    }, 
    "String.prototype[@@iterator]": {
        "description": "The [@@iterator]() method returns a new Iterator object that iterates over the code points of a String value, returning each code point as a String value.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator", 
        "usage": "string[Symbol.iterator]"
    }, 
    "String.raw": {
        "description": "The static String.raw() method is a tag function of template strings, like the r prefix in Python or the @ prefix in C# for string literals, this function is used to get the raw string form of template strings.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw", 
        "usage": "\nString.raw(callSite, ...substitutions)\n\nString.raw`templateString`\n\nParameters\n  callSite\n    Well-formed template call site object, like { raw: 'string' }.\n  ...substitutions\n    Contains substitution values.\n  templateString\n    A template string, optionally with substitutions (${...})."
    }, 
    "Symbol": {
        "description": "A symbol is a unique and immutable data type and may be used as an identifier for object properties. The symbol object is an implicit object wrapper for the symbol primitive data type.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol", 
        "usage": "Symbol([description])\nParameters\n  description Optional\n    Optional, string. A description of the symbol which can be used\n    for debugging but not to access the symbol itself."
    }, 
    "Symbol.for": {
        "description": "The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for", 
        "usage": "Symbol.for(key);\nParameters\n  key\n    String, required. The key for the symbol (and also used for the\n    description of the symbol)."
    }, 
    "Symbol.keyFor": {
        "description": "The Symbol.keyFor(sym) method retrieves a shared symbol key from the global symbol registry for the given symbol.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor", 
        "usage": "Symbol.keyFor(sym);\nParameters\n  sym\n    Symbol, required. The symbol to find a key for."
    }, 
    "Symbol.prototype": {
        "description": "The Symbol.prototype property represents the prototype for the Symbol constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/prototype"
    }, 
    "Symbol.prototype.toSource": {
        "description": "The toSource() method returns a string representing the source code of the object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toSource", 
        "usage": "Symbol.toSource()\n\nvar sym = Symbol()\nsym.toSource()"
    }, 
    "Symbol.prototype.toString": {
        "description": "The toString() method returns a string representing the specified Symbol object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toString", 
        "usage": "Symbol().toString();"
    }, 
    "Symbol.prototype.valueOf": {
        "description": "The valueOf() method returns the primitive value of a Symbol object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/valueOf", 
        "usage": "Symbol().valueOf();\n"
    }, 
    "SyntaxError": {
        "description": "The SyntaxError object represents an error when trying to interpret syntactically invalid code.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError", 
        "usage": "new SyntaxError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "TypeError": {
        "description": "The TypeError object represents an error when a value is not of the expected type.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError", 
        "usage": "new TypeError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "TypedArray": {
        "description": "A TypedArray object describes an array-like view of an underlying binary data buffer. There is no global property named TypedArray, nor is there a directly visible TypedArray constructor.  Instead, there are a number of different global properties, whose values are typed array constructors for specific element types.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray", 
        "usage": "new TypedArray(length);\nnew TypedArray(typedArray);\nnew TypedArray(object);\nnew TypedArray(buffer [, byteOffset [, length]]);\n\nwhere TypedArray is one of:\n\nInt8Array();\nUint8Array();\nUint8ClampedArray();\nInt16Array();\nUint16Array();\nInt32Array();\nUint32Array();\nFloat32Array();\nFloat64Array();\n\nParameters\n  length\n    When called with a length argument, a typed array containing\n    length zeroes is created.\n  typedArray\n    When called with a typedArray argument, which can be an object of\n    any of the typed array types (such as Int32Array), the typedArray\n    gets copied into a new typed array. Each value in typedArray is\n    converted to the corresponding type of the constructor before\n    being copied into the new array.\n  object\n    When called with an object argument, a new typed array is created\n    as if by the TypedArray.from() method.\n  buffer, byteOffset, length\n    When called with a buffer, and optional a byteOffset and a length\n    argument, a new typed array view is created that views the\n    specified ArrayBuffer. The byteOffset and length parameters\n    specify the memory range that will be exposed by the typed array\n    view.  If both are omitted, all of buffer is viewed; if only\n    length is omitted, the remainder of buffer is viewed."
    }, 
    "TypedArray.BYTES_PER_ELEMENT": {
        "description": "The TypedArray.BYTES_PER_ELEMENT property represents the size in bytes of each element in an typed array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/BYTES_PER_ELEMENT"
    }, 
    "TypedArray.from": {
        "description": "The TypedArray.from() method creates a new typed array from an array-like or iterable object. This method is nearly the same as Array.from().", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from", 
        "usage": "TypedArray.from(source[, mapFn[, thisArg]])\n\nwhere TypedArray is one of:\n\nInt8Array\nUint8Array\nUint8ClampedArray\nInt16Array\nUint16Array\nInt32Array\nUint32Array\nFloat32Array\nFloat64Array\n\nParameters\n  source\n    An array-like or iterable object to convert to a typed array.\n  mapFn\n    Optional. Map function to call on every element of the typed\n    array.\n  thisArg\n    Optional. Value to use as this when executing mapFn."
    }, 
    "TypedArray.name": {
        "description": "The TypedArray.name property represents a string value of the typed array constructor name.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/name"
    }, 
    "TypedArray.of": {
        "description": "The TypedArray.of() method creates a new typed array with a variable number of arguments. This method is nearly the same as Array.of().", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/of", 
        "usage": "TypedArray.of(element0[, element1[, ...[, elementN]]])\n\nwhere TypedArray is one of:\n\nInt8Array\nUint8Array\nUint8ClampedArray\nInt16Array\nUint16Array\nInt32Array\nUint32Array\nFloat32Array\nFloat64Array\nParameters\n  elementN\n    Elements of which to create the typed array."
    }, 
    "TypedArray.prototype": {
        "description": "The TypedArray.prototype property represents the prototype for TypedArray constructors.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/prototype"
    }, 
    "TypedArray.prototype.buffer": {
        "description": "The buffer accessor property represents the ArrayBuffer referenced by a TypedArray at construction time.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/buffer"
    }, 
    "TypedArray.prototype.byteLength": {
        "description": "The byteLength accessor property represents the length (in bytes) of a typed array from the start of its ArrayBuffer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/byteLength"
    }, 
    "TypedArray.prototype.byteOffset": {
        "description": "The byteOffset accessor property represents the offset (in bytes) of a typed array from the start of its ArrayBuffer.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/byteOffset"
    }, 
    "TypedArray.prototype.copyWithin": {
        "description": "The copyWithin() method copies the sequence of array elements within the array to the position starting at target. The copy is taken from the index positions of the second and third arguments start and end. The end argument is optional and defaults to the length of the array. This method has the same algorithm as Array.prototype.copyWithin. TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/copyWithin", 
        "usage": "typedarray.copyWithin(target, start[, end = this.length])\nParameters\n  target\n    Target start index position where to copy the elements to.\n  start\n    Source start index position where to start copying elements from.\n  end Optional\n    Optional. Source end index position where to end copying elements\n    from."
    }, 
    "TypedArray.prototype.entries": {
        "description": "The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/entries", 
        "usage": "arr.entries()"
    }, 
    "TypedArray.prototype.every": {
        "description": "The every() method tests whether all elements in the typed array pass the test implemented by the provided function. This method has the same algorithm as Array.prototype.every(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/every", 
        "usage": "typedarray.every(callback[, thisArg])\nParameters\n  callback\n    Function to test for each element, taking three arguments:\n    currentValue      The current element being processed in the typed\n    array.  index      The index of the current element being\n    processed in the typed array.  array      The typed array every\n    was called upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "TypedArray.prototype.fill": {
        "description": "The fill() method fills all the elements of a typed array from a start index to an end index with a static value. This method has the same algorithm as Array.prototype.fill(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill", 
        "usage": "typedarray.fill(value[, start = 0[, end = this.length]])\nParameters\n  value\n    Value to fill the typed array with.\n  start\n    Optional. Start index. Defaults to 0.\n  end\n    Optional. End index. Defaults to 0."
    }, 
    "TypedArray.prototype.find": {
        "description": "The find() method returns a value in the typed array, if an element satisfies the provided testing function. Otherwise undefined is returned. TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/find", 
        "usage": "typedarray.find(callback[, thisArg])\nParameters\n  callback\n    Function to execute on each value in the typed array, taking three\n    arguments:     element      The current element being processed in\n    the typed array.  index      The index of the current element\n    being processed in the typed array.  array      The array find was\n    called upon.\n  thisArg\n    Optional. Object to use as this when executing callback."
    }, 
    "TypedArray.prototype.findIndex": {
        "description": "The findIndex() method returns an index in the typed array, if an element in the typed array satisfies the provided testing function. Otherwise -1 is returned.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/findIndex", 
        "usage": "typedarray.findIndex(callback[, thisArg])\nParameters\n  callback\n    Function to execute on each value in the typed array, taking three\n    arguments:     element      The current element being processed in\n    the typed array.  index      The index of the current element\n    being processed in the typed array.  array      The typed array\n    findIndex was called upon.\n  thisArg\n    Optional. Object to use as this when executing callback."
    }, 
    "TypedArray.prototype.forEach": {
        "description": "The forEach() method executes a provided function once per array element. This method has the same algorithm as Array.prototype.forEach(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/forEach", 
        "usage": "typedarray.forEach(callback[, thisArg])\nParameters\n  callback\n    Function that produces an element of the new typed array, taking\n    three arguments:   currentValue The current element being\n    processed in the typed array. index The index of the current\n    element being processed in the array. array The array forEach()\n    was called upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "TypedArray.prototype.includes": {
        "description": "The includes() method determines whether a typed array includes a certain element, returning true or false as appropriate. This method has the same algorithm as Array.prototype.includes(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/includes", 
        "usage": "typedarray.includes(searchElement[, fromIndex]);\nParameters\n  searchElement\n    The element to search for.\n  fromIndex\n    Optional. The position in this array at which to begin searching\n    for searchElement; defaults to 0."
    }, 
    "TypedArray.prototype.indexOf": {
        "description": "The indexOf() method returns the first index at which a given element can be found in the typed array, or -1 if it is not present. This method has the same algorithm as Array.prototype.indexOf(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/indexOf", 
        "usage": "typedarray.indexOf(searchElement[, fromIndex = 0])\nParameters\n  searchElement\n    Element to locate in the typed array.\n  fromIndex\n    The index to start the search at. If the index is greater than or\n    equal to the typed array's length, -1 is returned, which means the\n    typed array will not be searched. If the provided index value is a\n    negative number, it is taken as the offset from the end of the\n    typed array. Note: if the provided index is negative, the typed\n    array is still searched from front to back. If the calculated\n    index is less than 0, then the whole typed array will be searched.\n    Default: 0 (entire typed array is searched)."
    }, 
    "TypedArray.prototype.join": {
        "description": "The join() method joins all elements of an array into a string. This method has the same algorithm as Array.prototype.join(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/join", 
        "usage": "typedarray.join([separator = ',']);\nParameters\n  separator\n    Optional. Specifies a string to separate each element. The\n    separator is converted to a string if necessary. If omitted, the\n    typed array elements are separated with a comma (\",\")."
    }, 
    "TypedArray.prototype.keys": {
        "description": "The keys() method returns a new Array Iterator object that contains the keys for each index in the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/keys", 
        "usage": "arr.keys()"
    }, 
    "TypedArray.prototype.lastIndexOf": {
        "description": "The lastIndexOf() method returns the last index at which a given element can be found in the typed array, or -1 if it is not present. The typed array is searched backwards, starting at fromIndex. This method has the same algorithm as Array.prototype.lastIndexOf(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/lastIndexOf", 
        "usage": "typedarray.lastIndexOf(searchElement[, fromIndex = typedarray.length])\nParameters\n  searchElement\n    Element to locate in the typed array.\n  fromIndex\n    Optional. The index at which to start searching backwards.\n    Defaults to the typed array's length, i.e. the whole typed array\n    will be searched. If the index is greater than or equal to the\n    length of the typed array, the whole typed array will be searched.\n    If negative, it is taken as the offset from the end of the typed\n    array. Note that even when the index is negative, the typed array\n    is still searched from back to front. If the calculated index is\n    less than 0, -1 is returned, i.e. the typed array will not be\n    searched."
    }, 
    "TypedArray.prototype.length": {
        "description": "The length accessor property represents the length (in elements) of a typed array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/length"
    }, 
    "TypedArray.prototype.move": {
        "description": "The move() method used to copy the sequence of array elements within the array to the position starting at target. However, this non-standard method has been replaced with the standard TypedArray.prototype.copyWithin() method. TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/move", 
        "usage": "typedarray.move(start, end, target)\n\nParameters\n  start\n    Source start index position where to start copying elements from.\n  end\n    Source end index position where to end copying elements from.\n  target\n    Target start index position where to copy the elements to."
    }, 
    "TypedArray.prototype.reduce": {
        "description": "The reduce() method applies a function against an accumulator and each value of the typed array (from left-to-right) has to reduce it to a single value. This method has the same algorithm as Array.prototype.reduce(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reduce", 
        "usage": "typedarray.reduce(callback[, initialValue])\nParameters\n  callback\n    Function to execute on each value in the typed array, taking four\n    arguments:   previousValue The value previously returned in the\n    last invocation of the callback, or initialValue, if supplied (see\n    below). currentValue The current element being processed in the\n    typed array. index The index of the current element being\n    processed in the typed array. array The typed array reduce was\n    called upon.\n  initialValue\n    Optional. Object to use as the first argument to the first call of\n    the callback."
    }, 
    "TypedArray.prototype.reduceRight": {
        "description": "The reduceRight() method applies a function against an accumulator and each value of the typed array (from right-to-left) has to reduce it to a single value. This method has the same algorithm as Array.prototype.reduceRight(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reduceRight", 
        "usage": "typedarray.reduceRight(callback[, initialValue])\nParameters\n  callback\n    Function to execute on each value in the typed array, taking four\n    arguments:   previousValue The value previously returned in the\n    last invocation of the callback, or initialValue, if supplied (see\n    below). currentValue The current element being processed in the\n    typed array. index The index of the current element being\n    processed in the typed array. array The typed array reduce was\n    called upon.\n  initialValue\n    Optional. Object to use as the first argument to the first call of\n    the callback."
    }, 
    "TypedArray.prototype.reverse": {
        "description": "The reverse() method reverses a typed array in place. The first typed array element becomes the last and the last becomes the first. This method has the same algorithm as Array.prototype.reverse(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reverse", 
        "usage": "typedarray.reverse();"
    }, 
    "TypedArray.prototype.set": {
        "description": "The set() method stores multiple values in the typed array, reading input values from a specified array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set", 
        "usage": "typedarr.set(array [,offset])\ntypedarr.set(typedarray [,offset])\n\nParameters\n  array\n    The array from which to copy values. All values from the source\n    array are copied into the target array, unless the length of the\n    source array plus the offset exceeds the length of the target\n    array, in which case an exception is thrown.\n  typedarray\n    If the source array is a typed array, the two arrays may share the\n    same underlying ArrayBuffer; the browser will intelligently copy\n    the source range of the buffer to the destination range.\n  offset Optional\n    The offset into the target array at which to begin writing values\n    from the source array. If you omit this value, 0 is assumed (that\n    is, the source array will overwrite values in the target array\n    starting at index 0)."
    }, 
    "TypedArray.prototype.some": {
        "description": "The some() method tests whether some element in the typed array passes the test implemented by the provided function. This method has the same algorithm as Array.prototype.some(). TypedArray is one of the typed array types here.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/some", 
        "usage": "typedarray.some(callback[, thisArg])\nParameters\n  callback\n    Function to test for each element, taking three arguments:\n    currentValue      The current element being processed in the typed\n    array.  index      The index of the current element being\n    processed in the typed array.  array      The typed array every\n    was called upon.\n  thisArg\n    Optional. Value to use as this when executing callback."
    }, 
    "TypedArray.prototype.subarray": {
        "description": "The subarray() method returns a new TypedArray on the same ArrayBuffer store and with the same element types as for this TypedArray object. The begin offset is inclusive and the end offset is exclusive. TypedArray is one of the typed array types.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray", 
        "usage": "typedarray.subarray([begin [,end]])\n\nParameters\n  begin Optional\n    Element to begin at. The offset is inclusive.\n  end Optional\n    Element to end at. The offset is exclusive. If not specified, all\n    elements from the one specified by begin to the end of the array\n    are included in the new view."
    }, 
    "TypedArray.prototype.values": {
        "description": "The values() method returns a new Array Iterator object that contains the values for each index in the array.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/values", 
        "usage": "arr.values()"
    }, 
    "TypedArray.prototype[@@iterator]": {
        "description": "The initial value of the @@iterator property is the same function object as the initial value of the values property.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/@@iterator", 
        "usage": "arr[Symbol.iterator]()"
    }, 
    "URIError": {
        "description": "The URIError object represents an error when a global URI handling function was used in a wrong way.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError", 
        "usage": "new URIError([message[, fileName[, lineNumber]]])\nParameters\n  message\n    Optional. Human-readable description of the error\n  fileName\n    Optional. The name of the file containing the code that caused the\n    exception\n  lineNumber\n    Optional. The line number of the code that caused the exception"
    }, 
    "Uint16Array": {
        "description": "The Uint16Array typed array represents an array of 16-bit unsigned integers in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array", 
        "usage": "Uint16Array(length);\nUint16Array(typedArray);\nUint16Array(object);\nUint16Array(buffer [, byteOffset [, length]]);"
    }, 
    "Uint32Array": {
        "description": "The Uint32Array typed array represents an array of 32-bit unsigned integers in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array", 
        "usage": "Uint32Array(length);\nUint32Array(typedArray);\nUint32Array(object);\nUint32Array(buffer [, byteOffset [, length]]);"
    }, 
    "Uint8Array": {
        "description": "The Uint8Array typed array represents an array of 8-bit unsigned integers. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array", 
        "usage": "Uint8Array(length);\nUint8Array(typedArray);\nUint8Array(object);\nUint8Array(buffer [, byteOffset [, length]]);"
    }, 
    "Uint8ClampedArray": {
        "description": "The Uint8ClampedArray typed array represents an array of 8-bit unsigned integers clamped to 0-255. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray", 
        "usage": "Uint8ClampedArray(length);\nUint8ClampedArray(typedArray);\nUint8ClampedArray(object);\nUint8ClampedArray(buffer [, byteOffset [, length]]);"
    }, 
    "WeakMap": {
        "description": "The WeakMap object is a collection of key/value pairs in which the keys are objects and the values can be arbitrary values.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap", 
        "usage": "new WeakMap([iterable])\n\nParameters\n  iterable\n    Iterable is an Array or other iterable object whose elements are\n    key-value pairs (2-element Arrays). Each key-value pair will be\n    added to the new WeakMap. null is treated as undefined."
    }, 
    "WeakMap.prototype": {
        "description": "The WeakMap.prototype property represents the prototype for the WeakMap constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/prototype"
    }, 
    "WeakMap.prototype.clear": {
        "description": "The clear() method removes all elements from a WeakMap object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/clear", 
        "usage": "wm.clear();"
    }, 
    "WeakMap.prototype.delete": {
        "description": "The delete() method removes the specified element from a WeakMap object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/delete", 
        "usage": "wm.delete(key);\nParameters\n  key\n    Required. The key of the element to remove from the WeakMap\n    object.\nReturns\nReturns true if an element in the WeakMap object has been removed successfully."
    }, 
    "WeakMap.prototype.get": {
        "description": "The get() method returns a specified element from a WeakMap object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/get", 
        "usage": "wm.get(key);\nParameters\n  key\n    Required. The key of the element to return from the WeakMap\n    object.\nReturns\nReturns the element associated with the specified key or undefined if the key can't be found in the WeakMap object."
    }, 
    "WeakMap.prototype.has": {
        "description": "The has() method returns a boolean indicating whether an element with the specified key exists in the WeakMap object or not.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/has", 
        "usage": "wm.has(key);\nParameters\n  key\n    Required. The key of the element to test for presence in the\n    WeakMap object."
    }, 
    "WeakMap.prototype.set": {
        "description": "The set() method adds a new element with a specified key and value to a WeakMap object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/set", 
        "usage": "wm.set(key, value);\nParameters\n  key\n    Required. The key of the element to add to the WeakMap object.\n  value\n    Required. The value of the element to add to the WeakMap object.\nReturns\nThe WeakMap object."
    }, 
    "WeakSet": {
        "description": "The WeakSet object lets you store weakly held objects in a collection.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet", 
        "usage": " new WeakSet([iterable]);\nParameters\n  iterable\n    If an iterable object is passed, all of its elements will be added\n    to the new WeakSet. null is treated as undefined."
    }, 
    "WeakSet.prototype": {
        "description": "The WeakSet.prototype property represents the prototype for the WeakSet constructor.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/prototype"
    }, 
    "WeakSet.prototype.add": {
        "description": "The add() method appends a new object to the end of a WeakSet object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/add", 
        "usage": "ws.add(value);\nParameters\n  value\n    Required. The object to add to the WeakSet collection."
    }, 
    "WeakSet.prototype.clear": {
        "description": "The clear() method removes all elements from a WeakSet object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/clear", 
        "usage": "ws.clear();"
    }, 
    "WeakSet.prototype.delete": {
        "description": "The delete() method removes the specified element from a WeakSet object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/delete", 
        "usage": "ws.delete(value);\nParameters\n  value\n    Required. The object remove from the WeakSet object.\nReturns\nReturns true if an element in the WeakSet object has been removed successfully; otherwise false."
    }, 
    "WeakSet.prototype.has": {
        "description": "The has() method returns a boolean indicating whether an object exists in a WeakSet or not.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/has", 
        "usage": "ws.has(value);\nParameters\n  value\n    Required. The object to test for presence in the WeakSet."
    }, 
    "decodeURI": {
        "description": "The decodeURI() function decodes a Uniform Resource Identifier (URI) previously created by encodeURI or by a similar routine.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI", 
        "usage": "decodeURI(encodedURI)\nParameters\n  encodedURI\n    A complete, encoded Uniform Resource Identifier."
    }, 
    "decodeURIComponent": {
        "description": "The decodeURIComponent() method decodes a Uniform Resource Identifier (URI) component previously created by encodeURIComponent or by a similar routine.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent", 
        "usage": "decodeURIComponent(encodedURI)\nParameters\n  encodedURI\n    An encoded component of a Uniform Resource Identifier."
    }, 
    "encodeURI": {
        "description": "The encodeURI() method encodes a Uniform Resource Identifier (URI) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape sequences for characters composed of two \"surrogate\" characters).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI", 
        "usage": "encodeURI(URI)\nParameters\n  URI\n    A complete Uniform Resource Identifier."
    }, 
    "encodeURIComponent": {
        "description": "The encodeURIComponent() method encodes a Uniform Resource Identifier (URI) component by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape sequences for characters composed of two \"surrogate\" characters).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent", 
        "usage": "encodeURIComponent(str);\nParameters\n  str\n    String. A component of a URI."
    }, 
    "escape": {
        "description": "The deprecated escape() method computes a new string in which certain characters have been replaced by a hexadecimal escape sequence. Use encodeURI or encodeURIComponent instead.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape", 
        "usage": "escape(str)\nParameters\n  str\n    A string to be encoded."
    }, 
    "eval": {
        "description": "The eval() method evaluates JavaScript code represented as a string.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval", 
        "usage": "eval(string)\nParameters\n  string\n    A string representing a JavaScript expression, statement, or\n    sequence of statements. The expression can include variables and\n    properties of existing objects."
    }, 
    "isFinite": {
        "description": "The global isFinite() function determines whether the passed value is a finite number. If needed, the parameter is first converted to a number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite", 
        "usage": "isFinite(testValue)\nParameters\n  testValue\n    The value to be tested for finiteness."
    }, 
    "isNaN": {
        "description": "The isNaN() function determines whether a value is NaN or not. Note: coercion inside the isNaN function has interesting rules; you may alternatively want to use Number.isNaN(), as defined in ECMAScript 6, or you can use typeof to determine if the value is Not-A-Number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN", 
        "usage": "isNaN(testValue)\nParameters\n  testValue\n    The value to be tested."
    }, 
    "null": {
        "description": "The value null is a JavaScript literal representing null or an \"empty\" value, i.e. no object value is present. It is one of JavaScript's primitive values.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null", 
        "usage": "null "
    }, 
    "parseFloat": {
        "description": "The parseFloat() function parses a string argument and returns a floating point number.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat", 
        "usage": "parseFloat(string)\nParameters\n  string\n    A string that represents the value you want to parse."
    }, 
    "parseInt": {
        "description": "The parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems).", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt", 
        "usage": "parseInt(string, radix);"
    }, 
    "undefined": {
        "description": "The global undefined value property represents the value undefined. It is one of JavaScript's primitive types.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined", 
        "usage": "undefined"
    }, 
    "unescape": {
        "description": "The deprecated unescape() method computes a new string in which hexadecimal escape sequences are replaced with the character that it represents. The escape sequences might be introduced by a function like escape. Because unescape is deprecated, use decodeURI or decodeURIComponent instead.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape", 
        "usage": "unescape(str)\nParameters\n  str\n    A string to be decoded."
    }, 
    "uneval": {
        "description": "The uneval() method creates an string representation of the source code of an Object.", 
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/uneval", 
        "usage": "uneval(object)\nParameters\n  object\n    A JavaScript expression or statement."
    }
};
