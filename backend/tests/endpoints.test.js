import {
    getProducts,
    getProductById,
} from '../controllers/product-controller.js';
import Product from '../models/product-model.js';

describe('getProducts', () => {
    it('should fetch all products', async () => {
        const req = { query: {} };
        const res = {
            json: jest.fn().mockResolvedValueOnce(),
        };

        const expectedProducts = [      { name: 'Product 1', price: 10 },      { name: 'Product 2', price: 20 },    ];

        jest.spyOn(Product, 'countDocuments').mockResolvedValueOnce(2);
        jest.spyOn(Product, 'find').mockReturnValueOnce({
            limit: jest.fn().mockReturnValueOnce({
                skip: jest.fn().mockReturnValueOnce(expectedProducts),
            }),
        });

        await getProducts(req, res);

        expect(Product.countDocuments).toHaveBeenCalledWith({});
        expect(Product.find).toHaveBeenCalledWith({});
        expect(res.json).toHaveBeenCalledWith({
            products: expectedProducts,
            page: 1,
            pages: 1,
        });
    });

    it('should fetch products with pagination and keyword search', async () => {
        const req = { query: { pageNumber: '2', keyword: 'product' } };
        const res = {
            json: jest.fn().mockResolvedValueOnce(),
        };

        const expectedProducts = [{ name: 'Product 3', price: 30 }];

        jest.spyOn(Product, 'countDocuments').mockResolvedValueOnce(3);
        jest.spyOn(Product, 'find').mockReturnValueOnce({
            limit: jest.fn().mockReturnValueOnce({
                skip: jest.fn().mockReturnValueOnce(expectedProducts),
            }),
        });

        await getProducts(req, res);

        expect(Product.countDocuments).toHaveBeenCalledWith({
            name: { $regex: 'product', $options: 'i' },
        });
        expect(Product.find).toHaveBeenCalledWith({
            name: { $regex: 'product', $options: 'i' },
        });
        expect(res.json).toHaveBeenCalledWith({
            products: expectedProducts,
            page: 2,
            pages: 1,
        });
    });

    it('should return empty array if no products found', async () => {
        const req = { query: {} };
        const res = {
            json: jest.fn().mockResolvedValueOnce(),
        };

        jest.spyOn(Product, 'countDocuments').mockResolvedValueOnce(0);

        await getProducts(req, res);

        expect(Product.countDocuments).toHaveBeenCalledWith({});
        expect(Product.find).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            products: [],
            page: 1,
            pages: 0,
        });
    },30000);
});

describe('getProductById', () => {
    it('should fetch a single product by id', async () => {
        const req = {params: {id: '123'}};
        const res = {
            json: jest.fn().mockResolvedValueOnce(),
            status: jest.fn(),
        };

        const expectedProduct = {name: 'Product 1', price: 10};

        jest.spyOn(Product, 'findById').mockResolvedValueOnce(expectedProduct);

        await getProductById(req, res);

        expect(Product.findById).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith(expectedProduct);
    });
});

