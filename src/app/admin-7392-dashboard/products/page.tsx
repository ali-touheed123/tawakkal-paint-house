'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  AlertTriangle,
  Palette,
  X as CloseIcon,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managingShadesProduct, setManagingShadesProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').eq('is_active', true);
    if (data) setCategories(data);
  }

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
    
    if (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
      return;
    }

    setProducts(products.filter(p => p.id !== id));
  }

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setCurrentImageUrl(editingProduct?.image_url || '');
      setImgError(false);
    }
  }, [isModalOpen, editingProduct]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      sub_category: formData.get('sub_category'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      price_quarter: Number(formData.get('price_quarter')),
      price_gallon: Number(formData.get('price_gallon')),
      price_drum: Number(formData.get('price_drum')),
      in_stock: formData.get('in_stock') === 'on',
      shade_card_url: formData.get('shade_card_url')
    };

    const supabase = createClient();
    if (editingProduct?.id) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      
      if (error) {
        console.error('Error updating product:', error);
        alert('Failed to save product: ' + error.message);
        return;
      }
      fetchProducts();
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      
      if (error) {
        console.error('Error creating product:', error);
        alert('Failed to create product: ' + error.message);
        return;
      }
      fetchProducts();
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setEditingProduct(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
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
                        onClick={() => setManagingShadesProduct(product)}
                        className="p-2 text-gray-400 hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
                        title="Manage Shades"
                      >
                        <Palette size={18} />
                      </button>
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

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-gray-300" size={24} />
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="font-bold text-navy truncate">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.brand}</div>
                    <div className="mt-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                        product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                   <button 
                      onClick={() => setManagingShadesProduct(product)}
                      className="p-2.5 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-navy transition-all mb-1"
                      title="Manage Shades"
                   >
                     <Palette size={18} />
                   </button>
                   <button 
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="p-2.5 bg-gray-100 text-navy rounded-lg hover:bg-gold hover:text-navy transition-all"
                   >
                     <Edit2 size={18} />
                   </button>
                   <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200/50">
                 <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Quarter</div>
                    <div className="font-mono text-navy font-bold">{product.price_quarter}</div>
                 </div>
                 <div className="text-center border-x border-gray-200/50 px-2">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Gallon</div>
                    <div className="font-mono text-navy font-bold">{product.price_gallon}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Drum</div>
                    <div className="font-mono text-navy font-bold">{product.price_drum}</div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400 bg-gray-50">
            No products matches your search.
          </div>
        )}
      </div>

      {/* Product Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Product Name</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Brand</label>
                <input name="brand" defaultValue={editingProduct?.brand} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Category</label>
                <select name="category" defaultValue={editingProduct?.category || categories[0]?.slug} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Image URL</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input 
                      name="image_url" 
                      value={currentImageUrl}
                      onChange={(e) => {
                        setCurrentImageUrl(e.target.value);
                        setImgError(false);
                      }}
                      placeholder="/images/products/brand/name.png" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                    />
                    <p className="text-[9px] text-gray-400 mt-1 italic">
                      Filenames are case-sensitive. Path should start with /images/products/
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                    {currentImageUrl && !imgError ? (
                      <img 
                        src={currentImageUrl} 
                        alt="Preview" 
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[8px] text-gray-300 gap-1">
                        <Package size={16} />
                        <span>No Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Description</label>
                <textarea name="description" defaultValue={editingProduct?.description} rows={2} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none resize-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Shade Card PDF URL</label>
                <input 
                  name="shade_card_url" 
                  defaultValue={editingProduct?.shade_card_url} 
                  placeholder="https://example.com/shade-card.pdf" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                />
              </div>
              <div className="grid grid-cols-3 col-span-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Price (Q)</label>
                   <input name="price_quarter" type="number" defaultValue={editingProduct?.price_quarter} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Price (G)</label>
                   <input name="price_gallon" type="number" defaultValue={editingProduct?.price_gallon} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Price (D)</label>
                   <input name="price_drum" type="number" defaultValue={editingProduct?.price_drum} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" name="in_stock" id="in_stock" defaultChecked={editingProduct ? editingProduct.in_stock : true} className="w-4 h-4 accent-gold" />
                 <label htmlFor="in_stock" className="text-xs font-bold text-navy">In Stock</label>
              </div>
            </div>
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} className="px-5 py-2 text-sm text-gray-500 font-bold hover:text-navy">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy/90 shadow-md transition-all active:scale-95">Save Product</button>
            </div>
          </form>
        </div>
      )}

      {/* Shade Management Modal */}
      {managingShadesProduct && (
        <ShadeManagementModal 
          product={managingShadesProduct}
          onClose={() => setManagingShadesProduct(null)}
        />
      )}
    </div>
  );
}

function ShadeManagementModal({ product, onClose }: { product: any, onClose: () => void }) {
  const [shades, setShades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchShades();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  async function fetchShades() {
    setLoading(true);
    const { data } = await supabase
      .from('product_shades')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: true });
    
    if (data) setShades(data);
    setLoading(false);
  }

  async function handleAddShade(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const hex = formData.get('hex') as string;
    
    const newShade = {
      product_id: product.id,
      name: formData.get('name'),
      code: formData.get('code'),
      hex: hex,
      is_drum_available: formData.get('is_drum_available') === 'on'
    };

    const { error } = await supabase.from('product_shades').insert([newShade]);
    if (error) {
      alert('Error adding shade: ' + error.message);
    } else {
      fetchShades();
      setIsAdding(false);
    }
  }

  async function handleDeleteShade(id: string) {
    if (!confirm('Delete this shade?')) return;
    const { error } = await supabase.from('product_shades').delete().eq('id', id);
    if (!error) {
      setShades(shades.filter(s => s.id !== id));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-navy p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Palette size={24} /> {product.name}
            </h2>
            <p className="text-xs text-gray-400">Manage color shades and availability</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-navy">Existing Shades ({shades.length})</h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-gold/10 text-gold hover:bg-gold hover:text-navy px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> {isAdding ? 'Cancel' : 'Add Shade'}
            </button>
          </div>

          {isAdding && (
            <AddShadeForm onSubmit={handleAddShade} />
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {loading ? (
              <div className="py-10 text-center text-gray-400"><Loader2 className="animate-spin mx-auto mb-2" /> Loading shades...</div>
            ) : shades.length === 0 ? (
              <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">No shades added yet.</div>
            ) : (
              shades.map((shade) => (
                <div key={shade.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-gray-100 shadow-inner" style={{ backgroundColor: shade.hex }} />
                    <div>
                      <div className="font-bold text-navy leading-tight">{shade.name}</div>
                      <div className="text-xs text-gray-400 font-mono tracking-tight">{shade.code} • {shade.hex}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                      shade.is_drum_available ? "bg-gold/10 text-gold" : "bg-gray-100 text-gray-400"
                    )}>
                      Drum: {shade.is_drum_available ? 'YES' : 'NO'}
                    </div>
                    <button 
                      onClick={() => handleDeleteShade(shade.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddShadeForm({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) {
  const [hex, setHex] = useState('#C9973A');
  
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gold/20 mb-6 animate-in slide-in-from-top duration-300">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Shade Name</label>
          <input name="name" required placeholder="e.g. Royal Gold" className="w-full p-2.5 bg-white border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Color Code</label>
          <input name="code" required placeholder="e.g. G-102" className="w-full p-2.5 bg-white border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">HEX Color</label>
          <div className="flex gap-2">
            <input 
              name="hex" 
              required 
              type="color" 
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="h-10 w-10 border-none rounded cursor-pointer p-0" 
            />
            <input 
              name="hex_text" 
              placeholder="#C9973A" 
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="flex-1 p-2.5 bg-white border border-gray-100 rounded-xl focus:outline-none text-sm font-mono uppercase" 
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-5">
           <input type="checkbox" name="is_drum_available" id="drum_add" className="w-4 h-4 accent-gold" />
           <label htmlFor="drum_add" className="text-xs font-bold text-navy">Drum Available</label>
        </div>
      </div>
      <button type="submit" className="w-full bg-navy text-white py-3 rounded-xl font-bold hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2">
        <Plus size={18} /> Save New Shade
      </button>
    </form>
  );
}

function Loader2({ className }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className}`} size={20} />;
}

import { Loader2 as Loader2Icon } from 'lucide-react';
