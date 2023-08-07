import { createRandomNumber } from "../string.utils";

describe('string utils test', () => {
    test('test random number', async () => {
        const randomNumber = createRandomNumber();
        console.log(randomNumber);
        return expect(randomNumber.length).toEqual(10)
    })
});