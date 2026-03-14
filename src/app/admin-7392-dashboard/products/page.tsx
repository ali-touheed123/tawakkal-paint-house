'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      price_quarter: Number(formData.get('price_quarter')),
      price_gallon: Number(formData.get('price_gallon')),
      price_drum: Number(formData.get('price_drum')),
      in_stock: formData.get('in_stock') === 'on'
    };

    const supabase = createClient();
    if (editingProduct?.id) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      if (!error) fetchProducts();
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      if (!error) fetchProducts();
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Products</h1>
          <p className="text-gray-500">Manage your inventory, prices, and availability.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Prices (Q/G/D)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-gray-300" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-navy">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    <div className="flex gap-2">
                       <span className="text-gray-400">Q:</span> <span className="text-navy">{product.price_quarter}</span>
                       <span className="text-gray-400 ml-2">G:</span> <span className="text-navy">{product.price_gallon}</span>
                       <span className="text-gray-400 ml-2">D:</span> <span className="text-navy">{product.price_drum}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Product Name</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Brand</label>
                <input name="brand" defaultValue={editingProduct?.brand} required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                <select name="category" defaultValue={editingProduct?.category || 'decorative'} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none">
                  <option value="decorative">Decorative</option>
                  <option value="industrial">Industrial</option>
                  <option value="auto">Auto</option>
                  <option value="projects">Projects</option>
                </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price (Quarter)</label>
                 <input name="price_quarter" type="number" defaultValue={editingProduct?.price_quarter} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price (Gallon)</label>
                 <input name="price_gallon" type="number" defaultValue={editingProduct?.price_gallon} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price (Drum)</label>
                 <input name="price_drum" type="number" defaultValue={editingProduct?.price_drum} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
              </div>
              <div className="flex items-center gap-3">
                 <input type="checkbox" name="in_stock" defaultChecked={editingProduct ? editingProduct.in_stock : true} className="w-5 h-5 accent-gold" />
                 <label className="text-sm font-bold text-navy">In Stock</label>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-bold hover:text-navy">Cancel</button>
              <button type="submit" className="px-8 py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 shadow-md">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
