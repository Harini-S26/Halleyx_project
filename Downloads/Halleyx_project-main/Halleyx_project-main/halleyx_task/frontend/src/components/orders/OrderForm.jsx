import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const COUNTRIES   = ['United States','Canada','Australia','Singapore','Hong Kong'];
const PRODUCTS    = ['Fiber Internet 300 Mbps','5G Unlimited Mobile Plan','Fiber Internet 1 Gbps','Business Internet 500 Mbps','VoIP Corporate Package'];
const STATUSES    = ['Pending','In Progress','Completed'];
const CREATED_BY  = ['Mr. Michael Harris','Mr. Ryan Cooper','Ms. Olivia Carter','Mr. Lucas Martin'];
const UNIT_PRICES = { 'Fiber Internet 300 Mbps':49.99,'5G Unlimited Mobile Plan':39.99,'Fiber Internet 1 Gbps':89.99,'Business Internet 500 Mbps':129.99,'VoIP Corporate Package':199.99 };

const EMPTY = {
  firstName:'', lastName:'', email:'', phone:'',
  street:'', city:'', state:'', postalCode:'', country:'',
  product:'', quantity:1, unitPrice:0, totalAmount:0,
  status:'Pending', createdBy:'',
  orderDate: new Date().toISOString().split('T')[0],
};

function TF({ form, errors, setField, label, fk, type='text', placeholder='', readOnly=false, col='' }) {
  return (
    <div className={col}>
      <label className="label">{label}</label>
      <input
        type={type}
        readOnly={readOnly}
        className={`input-field ${readOnly ? 'bg-zinc-50 dark:bg-zinc-800 cursor-default text-zinc-500 dark:text-zinc-400' : ''} ${errors[fk] ? 'border-red-400 focus:ring-red-200' : ''}`}
        placeholder={placeholder}
        value={form[fk] ?? ''}
        onChange={e => !readOnly && setField(fk, e.target.value)}
      />
      {errors[fk] && <p className="text-xs text-red-500 mt-1">⚠ {errors[fk]}</p>}
    </div>
  );
}

function SF({ form, errors, setField, label, fk, options, col='' }) {
  return (
    <div className={col}>
      <label className="label">{label}</label>
      <div className="relative">
        <select
          className={`select-field ${errors[fk] ? 'border-red-400 focus:ring-red-200' : ''}`}
          value={form[fk] || ''}
          onChange={e => setField(fk, e.target.value)}
        >
          <option value="">Select {label.replace(' *','')}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      </div>
      {errors[fk] && <p className="text-xs text-red-500 mt-1">⚠ {errors[fk]}</p>}
    </div>
  );
}

export default function OrderForm({ initialData, onSubmit, onClose, loading }) {
  const [form, setForm]     = useState(initialData ? { ...initialData } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData ? { ...initialData } : { ...EMPTY });
    setErrors({});
  }, [initialData]);

  const setField = (k, v) => {
    setForm(f => {
      const u = { ...f, [k]: v };
      if (k === 'product') u.unitPrice = UNIT_PRICES[v] || 0;
      if (['product','quantity','unitPrice'].includes(k)) {
        const qty   = k === 'quantity'  ? Number(v) : Number(u.quantity);
        const price = k === 'unitPrice' ? Number(v) : Number(u.unitPrice);
        u.totalAmount = (qty * price).toFixed(2);
      }
      return u;
    });
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const required = ['firstName','lastName','email','phone','street','city','state','postalCode','country','product','status','createdBy','orderDate'];
    const e = {};
    required.forEach(k => { if (!form[k] || String(form[k]).trim() === '') e[k] = 'Please fill the field'; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (Number(form.quantity) < 1) e.quantity = 'Min quantity is 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => { e.preventDefault(); if (validate()) onSubmit(form); };

  const p = { form, errors, setField };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">

        {/* Customer Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-brand-500" />
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Customer Information</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TF {...p} label="First Name *"      fk="firstName"  placeholder="John" />
            <TF {...p} label="Last Name *"        fk="lastName"   placeholder="Smith" />
            <TF {...p} label="Email *"            fk="email"      type="email" placeholder="john@company.com" />
            <TF {...p} label="Phone Number *"     fk="phone"      placeholder="+1 555 0100" />
            <TF {...p} label="Street Address *"   fk="street"     placeholder="123 Main Street" col="sm:col-span-2" />
            <TF {...p} label="City *"             fk="city"       placeholder="New York" />
            <TF {...p} label="State / Province *" fk="state"      placeholder="NY" />
            <TF {...p} label="Postal Code *"      fk="postalCode" placeholder="10001" />
            <SF {...p} label="Country *"          fk="country"    options={COUNTRIES} />
          </div>
        </div>

        {/* Order Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-brand-500" />
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Order Information</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SF {...p} label="Choose Product *" fk="product" options={PRODUCTS} col="sm:col-span-2" />

            <div>
              <label className="label">Quantity *</label>
              <input
                type="number"
                min={1}
                className={`input-field ${errors.quantity ? 'border-red-400' : ''}`}
                value={form.quantity}
                onChange={e => setField('quantity', Math.max(1, Number(e.target.value)))}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">⚠ {errors.quantity}</p>}
            </div>

            <div>
              <label className="label">Unit Price *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-sm pointer-events-none">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={`input-field pl-7 ${errors.unitPrice ? 'border-red-400' : ''}`}
                  value={form.unitPrice}
                  onChange={e => setField('unitPrice', e.target.value)}
                />
              </div>
              {errors.unitPrice && <p className="text-xs text-red-500 mt-1">⚠ {errors.unitPrice}</p>}
            </div>

            <div>
              <label className="label">Total Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-sm pointer-events-none">$</span>
                <input
                  type="text"
                  readOnly
                  className="input-field pl-7 bg-zinc-50 dark:bg-zinc-800 cursor-default text-zinc-600 dark:text-zinc-400 font-semibold"
                  value={form.totalAmount}
                />
              </div>
            </div>

            <TF {...p} label="Order Date *" fk="orderDate" type="date" />
            <SF {...p} label="Status *"     fk="status"    options={STATUSES} />
            <SF {...p} label="Created By *" fk="createdBy" options={CREATED_BY} col="sm:col-span-2" />
          </div>
        </div>

      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading
            ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</span>
            : initialData ? 'Update Order' : 'Create Order'
          }
        </button>
      </div>
    </form>
  );
}