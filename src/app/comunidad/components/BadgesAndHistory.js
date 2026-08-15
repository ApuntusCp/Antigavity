"use client";

import React, { useState, useEffect } from 'react';
import { Award, ShoppingBag, Share2, Copy, CheckCircle, Package, ArrowUpRight, Lock, Check, Leaf, MessageSquare, ShieldCheck, Crown } from 'lucide-react';

export default function BadgesAndHistory({ user, clientData }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [referralCopied, setReferralCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'orders' | 'referral'

  const referralCode = clientData?.couponCode || (user?.uid ? user.uid.substring(0, 6).toUpperCase() : 'GC-CLUB');
  const referralUrl = typeof window !== 'undefined' ? `${window.location.origin}/registro?ref=${referralCode}` : `https://grancolinos.com/registro?ref=${referralCode}`;

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/club/orders?uid=${user.uid}&email=${encodeURIComponent(user.email || '')}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error loading user orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  };

  // Badges logic with luxury SVG icons
  const badgesList = [
    {
      id: 'pionero',
      name: 'Pionero del Club',
      desc: 'Miembro registrado de la comunidad Gran Colinos',
      IconComponent: Leaf,
      iconColor: 'text-emerald-400',
      unlocked: true
    },
    {
      id: 'primer_pedido',
      name: 'Primer Pedido',
      desc: 'Ha realizado al menos una compra en la tienda',
      IconComponent: ShoppingBag,
      iconColor: 'text-amber-400',
      unlocked: (clientData?.purchaseCount > 0) || orders.length > 0
    },
    {
      id: 'voz_activa',
      name: 'Voz del Club',
      desc: 'Ha compartido su testimonio o experiencia en el foro',
      IconComponent: MessageSquare,
      iconColor: 'text-yellow-400',
      unlocked: (clientData?.ecoPoints >= 70)
    },
    {
      id: 'verificado',
      name: 'Profesional Verificado',
      desc: 'Acreditación formal médica o técnica validada por GC Admin',
      IconComponent: ShieldCheck,
      iconColor: 'text-emerald-300',
      unlocked: Boolean(clientData?.verifiedProfession)
    },
    {
      id: 'elite',
      name: 'Miembro Élite Oro',
      desc: 'Alcanzó el rango VIP máximo de 500+ Eco-Points',
      IconComponent: Crown,
      iconColor: 'text-brand-gold',
      unlocked: clientData?.vipLevel === 'Oro' || (clientData?.ecoPoints >= 500)
    }
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl mb-12">
      {/* Navigation tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/40 px-6 pt-3 gap-6 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'badges'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Award size={16} /> Insignias ({badgesList.filter(b => b.unlocked).length}/{badgesList.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={16} /> Historial de Compras ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('referral')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'referral'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Share2 size={16} /> Invita a un Amigo (+50 pts)
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 md:p-8">
        {/* TAB 1: BADGES */}
        {activeTab === 'badges' && (
          <div>
            <div className="mb-6">
              <h3 className="font-playfair text-xl text-brand-dark dark:text-white font-bold mb-1">
                Tus Insignias de Reconocimiento
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Logros desbloqueados por tu compromiso y lealtad con Gran Colinos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badgesList.map(badge => {
                const Icon = badge.IconComponent;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      badge.unlocked
                        ? 'bg-brand-gold/5 border-brand-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                        : 'bg-black/20 border-white/5 opacity-50 grayscale'
                    }`}
                  >
                    <div className="p-3 bg-black/50 rounded-xl border border-white/10 shrink-0 flex items-center justify-center">
                      <Icon size={20} className={badge.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-bold text-brand-dark dark:text-white uppercase tracking-wider truncate">
                          {badge.name}
                        </h4>
                        {badge.unlocked ? (
                          <Check size={12} className="text-brand-gold shrink-0" />
                        ) : (
                          <Lock size={12} className="text-gray-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS HISTORY */}
        {activeTab === 'orders' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-playfair text-xl text-brand-dark dark:text-white font-bold mb-1">
                  Historial de Compras Vinculado
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tus pedidos realizados en la tienda oficial Gran Colinos.
                </p>
              </div>
              <a
                href="/shop"
                className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
              >
                Ir a la Tienda <ArrowUpRight size={14} />
              </a>
            </div>

            {loadingOrders ? (
              <div className="py-8 text-center text-gray-400 text-xs">Cargando tus pedidos...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <Package size={36} className="text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-light mb-4">Aún no has realizado ninguna compra con tu cuenta.</p>
                <a
                  href="/shop"
                  className="inline-block bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Explorar Catálogo de Productos
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs font-bold text-white">Orden #{order.id.substring(0, 8)}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          order.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          order.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {order.status === 'paid' ? 'Pagado' : order.status === 'pending_payment' ? 'Pendiente' : order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ') || `${order.itemsCount} productos`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-bold text-white font-mono">
                        ${(order.total || 0).toLocaleString('es-CO')} COP
                      </p>
                      <span className="text-[10px] text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-CO') : 'Reciente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REFERRAL CTA */}
        {activeTab === 'referral' && (
          <div className="max-w-2xl mx-auto text-center py-4">
            <div className="inline-flex p-3 bg-brand-gold/10 rounded-full border border-brand-gold/30 text-brand-gold mb-4">
              <Share2 size={28} />
            </div>
            <h3 className="font-playfair text-2xl text-brand-dark dark:text-white font-bold mb-2">
              Invita a un Amigo y Gana +50 Eco-Points
            </h3>
            <p className="text-sm text-gray-400 mb-6 font-light max-w-lg mx-auto">
              Comparte tu enlace exclusivo de invitación. Tu amigo recibe un <strong className="text-brand-gold">10% de descuento</strong> en su primera compra y tú recibes <strong className="text-brand-gold">50 Eco-Points</strong> automáticos para subir de rango.
            </p>

            <div className="bg-black/60 border border-brand-gold/40 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between max-w-xl mx-auto mb-4">
              <span className="font-mono text-xs text-gray-300 truncate max-w-md text-left">
                {referralUrl}
              </span>
              <button
                type="button"
                onClick={copyReferral}
                className="bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                {referralCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {referralCopied ? '¡COPIADO!' : 'COPIAR ENLACE'}
              </button>
            </div>
            
            <p className="text-[11px] text-gray-500">
              Código asignado: <strong className="text-white font-mono">{referralCode}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
