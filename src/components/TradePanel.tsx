import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offering: {
    funding: number;
    collaboration: number;
    special: number;
    cards?: string[];
  };
  requesting: {
    funding: number;
    collaboration: number;
    special: number;
    cards?: string[];
  };
  message?: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  expiresAt?: number;
}

interface TokenTransferProps {
  type: 'funding' | 'collaboration' | 'special';
  amount: number;
  onAmountChange: (amount: number) => void;
  maxAmount: number;
  direction: 'offer' | 'request';
}

const TokenTransfer: React.FC<TokenTransferProps> = ({
  type,
  amount,
  onAmountChange,
  maxAmount
}) => {
  const { lang, highContrast } = useGameStore();

  const getTokenConfig = () => {
    switch (type) {
      case 'funding':
        return {
          icon: '💰',
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800',
          borderClass: 'border-yellow-300',
          label: { en: 'Funding', zh: '资金' }
        };
      case 'collaboration':
        return {
          icon: '🤝',
          bgClass: 'bg-blue-100',
          textClass: 'text-blue-800',
          borderClass: 'border-blue-300',
          label: { en: 'Collaboration', zh: '合作' }
        };
      case 'special':
        return {
          icon: '⭐',
          bgClass: 'bg-purple-100',
          textClass: 'text-purple-800',
          borderClass: 'border-purple-300',
          label: { en: 'Special', zh: '特殊' }
        };
    }
  };

  const config = getTokenConfig();

  return (
    <div 
      className={`
        flex items-center gap-2 p-2 rounded border-2 transition-all
        ${config.bgClass} ${config.borderClass}
        ${highContrast ? 'border-4' : ''}
      `}
    >
      <span role="img" aria-hidden="true">{config.icon}</span>
      <span className="text-sm font-medium">{config.label[lang]}</span>
      
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => onAmountChange(Math.max(0, amount - 1))}
          disabled={amount <= 0}
          className="w-6 h-6 bg-white border rounded text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
          aria-label={`Decrease ${config.label[lang]}`}
        >
          −
        </button>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(Math.max(0, Math.min(maxAmount, parseInt(e.target.value) || 0)))}
          min="0"
          max={maxAmount}
          className="w-12 text-center border rounded text-sm"
          aria-label={`${config.label[lang]} amount`}
        />
        
        <button
          onClick={() => onAmountChange(Math.min(maxAmount, amount + 1))}
          disabled={amount >= maxAmount}
          className="w-6 h-6 bg-white border rounded text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
          aria-label={`Increase ${config.label[lang]}`}
        >
          +
        </button>
      </div>
      
      <span className="text-xs text-gray-500">/{maxAmount}</span>
    </div>
  );
};

const TradePanel: React.FC = () => {
  const { 
    gameState, 
    lang, 
    highContrast, 
    reducedMotion,
    addEvent 
  } = useGameStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [offering, setOffering] = useState({
    funding: 0,
    collaboration: 0,
    special: 0
  });
  const [requesting, setRequesting] = useState({
    funding: 0,
    collaboration: 0,
    special: 0
  });
  const [message, setMessage] = useState('');
  const [trades, setTrades] = useState<TradeOffer[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for trading phase
  const [isDragging] = useState(false);

  // Timer for trading phase
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  // Auto-expire trades
  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(current => 
        current.map(trade => {
          if (trade.expiresAt && Date.now() > trade.expiresAt && trade.status === 'pending') {
            return { ...trade, status: 'rejected' as const };
          }
          return trade;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPlayer = gameState?.players[gameState.currentPlayerIndex];
  const otherPlayers = gameState?.players.filter((_, index) => index !== gameState.currentPlayerIndex) || [];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'trade_panel': { en: 'Trade Panel', zh: '交易面板' },
      'time_left': { en: 'Time Left', zh: '剩余时间' },
      'trade_with': { en: 'Trade with', zh: '与...交易' },
      'offering': { en: 'Offering', zh: '提供' },
      'requesting': { en: 'Requesting', zh: '请求' },
      'message': { en: 'Message', zh: '消息' },
      'send_offer': { en: 'Send Offer', zh: '发送报价' },
      'pending_trades': { en: 'Pending Trades', zh: '待处理交易' },
      'accept': { en: 'Accept', zh: '接受' },
      'reject': { en: 'Reject', zh: '拒绝' },
      'counter': { en: 'Counter', zh: '还价' },
      'no_trades': { en: 'No pending trades', zh: '没有待处理的交易' },
      'trade_expired': { en: 'Trade expired', zh: '交易已过期' },
      'trade_sent': { en: 'Trade offer sent', zh: '交易报价已发送' },
      'invalid_trade': { en: 'Invalid trade', zh: '无效交易' }
    };
    return texts[key]?.[lang] || fallback;
  };

  const handleSendOffer = () => {
    if (!selectedPartner || !currentPlayer) return;

    // Validate offer
    const totalOffering = offering.funding + offering.collaboration + offering.special;
    const totalRequesting = requesting.funding + requesting.collaboration + requesting.special;
    
    if (totalOffering === 0 && totalRequesting === 0) {
      addEvent('trade_error', getText('invalid_trade', 'Invalid trade'));
      return;
    }

    // Check if player has enough tokens
    if (offering.funding > currentPlayer.tokens.funding ||
        offering.collaboration > currentPlayer.tokens.collaboration ||
        offering.special > currentPlayer.tokens.special) {
      addEvent('trade_error', 'Not enough tokens to offer');
      return;
    }

    const newTrade: TradeOffer = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromPlayerId: currentPlayer.id,
      toPlayerId: selectedPartner,
      offering,
      requesting,
      message: message.trim(),
      timestamp: Date.now(),
      status: 'pending',
      expiresAt: Date.now() + 60000 // 1 minute to respond
    };

    setTrades(prev => [...prev, newTrade]);
    addEvent('trade_sent', getText('trade_sent', 'Trade offer sent'));

    // Reset form
    setOffering({ funding: 0, collaboration: 0, special: 0 });
    setRequesting({ funding: 0, collaboration: 0, special: 0 });
    setMessage('');
  };

  const handleAcceptTrade = (tradeId: string) => {
    setTrades(prev => 
      prev.map(trade => 
        trade.id === tradeId ? { ...trade, status: 'accepted' as const } : trade
      )
    );
    addEvent('trade_accepted', `Trade ${tradeId.slice(-4)} accepted`);
  };

  const handleRejectTrade = (tradeId: string) => {
    setTrades(prev => 
      prev.map(trade => 
        trade.id === tradeId ? { ...trade, status: 'rejected' as const } : trade
      )
    );
    addEvent('trade_rejected', `Trade ${tradeId.slice(-4)} rejected`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg
          hover:bg-green-600 transition-all z-10
          ${!reducedMotion ? 'hover:scale-110' : ''}
        `}
        aria-label={getText('trade_panel', 'Trade Panel')}
      >
        🔄
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className={`
          bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto
          ${highContrast ? 'border-4 border-black' : ''}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-panel-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 id="trade-panel-title" className="text-lg font-semibold">
            {getText('trade_panel', 'Trade Panel')}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div 
              className={`
                flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                ${timeLeft <= 30 
                  ? 'bg-red-100 text-red-700' 
                  : timeLeft <= 60 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-green-100 text-green-700'
                }
              `}
              role="timer"
              aria-live="polite"
            >
              <span>⏰</span>
              <span>{getText('time_left', 'Time Left')}: {formatTime(timeLeft)}</span>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Close trade panel"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Trade Form */}
          <div className="space-y-4">
            {/* Partner Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {getText('trade_with', 'Trade with')}
              </label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select a player...</option>
                {otherPlayers.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Offering Section */}
            <div>
              <h3 className="text-sm font-medium mb-2 text-green-700">
                {getText('offering', 'Offering')}
              </h3>
              <div 
                className={`
                  space-y-2 p-3 border-2 border-dashed border-green-300 rounded-lg
                  ${isDragging ? 'border-green-500 bg-green-50' : ''}
                `}
              >
                <TokenTransfer
                  type="funding"
                  amount={offering.funding}
                  onAmountChange={(amount) => setOffering(prev => ({ ...prev, funding: amount }))}
                  maxAmount={currentPlayer?.tokens.funding || 0}
                  direction="offer"
                />
                <TokenTransfer
                  type="collaboration"
                  amount={offering.collaboration}
                  onAmountChange={(amount) => setOffering(prev => ({ ...prev, collaboration: amount }))}
                  maxAmount={currentPlayer?.tokens.collaboration || 0}
                  direction="offer"
                />
                <TokenTransfer
                  type="special"
                  amount={offering.special}
                  onAmountChange={(amount) => setOffering(prev => ({ ...prev, special: amount }))}
                  maxAmount={currentPlayer?.tokens.special || 0}
                  direction="offer"
                />
              </div>
            </div>

            {/* Requesting Section */}
            <div>
              <h3 className="text-sm font-medium mb-2 text-blue-700">
                {getText('requesting', 'Requesting')}
              </h3>
              <div 
                className={`
                  space-y-2 p-3 border-2 border-dashed border-blue-300 rounded-lg
                  ${isDragging ? 'border-blue-500 bg-blue-50' : ''}
                `}
              >
                <TokenTransfer
                  type="funding"
                  amount={requesting.funding}
                  onAmountChange={(amount) => setRequesting(prev => ({ ...prev, funding: amount }))}
                  maxAmount={10} // Max reasonable request
                  direction="request"
                />
                <TokenTransfer
                  type="collaboration"
                  amount={requesting.collaboration}
                  onAmountChange={(amount) => setRequesting(prev => ({ ...prev, collaboration: amount }))}
                  maxAmount={10}
                  direction="request"
                />
                <TokenTransfer
                  type="special"
                  amount={requesting.special}
                  onAmountChange={(amount) => setRequesting(prev => ({ ...prev, special: amount }))}
                  maxAmount={10}
                  direction="request"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {getText('message', 'Message')} (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to your trade offer..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                rows={2}
                maxLength={200}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendOffer}
              disabled={!selectedPartner}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {getText('send_offer', 'Send Offer')}
            </button>
          </div>

          {/* Pending Trades */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              {getText('pending_trades', 'Pending Trades')}
            </h3>
            
            {trades.filter(trade => trade.status === 'pending').length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                {getText('no_trades', 'No pending trades')}
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {trades
                  .filter(trade => trade.status === 'pending')
                  .map(trade => {
                    const fromPlayer = gameState?.players.find(p => p.id === trade.fromPlayerId);
                    const toPlayer = gameState?.players.find(p => p.id === trade.toPlayerId);
                    const isExpired = trade.expiresAt && Date.now() > trade.expiresAt;
                    
                    return (
                      <div 
                        key={trade.id}
                        className={`
                          border rounded-lg p-3 text-sm
                          ${isExpired ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}
                        `}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <strong>{fromPlayer?.name}</strong> → <strong>{toPlayer?.name}</strong>
                          </div>
                          {isExpired && (
                            <span className="text-red-600 text-xs">
                              {getText('trade_expired', 'Expired')}
                            </span>
                          )}
                        </div>
                        
                        {trade.message && (
                          <div className="text-gray-600 mb-2 italic">"{trade.message}"</div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="font-medium text-green-700">Offering:</div>
                            <div>💰 {trade.offering.funding}</div>
                            <div>🤝 {trade.offering.collaboration}</div>
                            <div>⭐ {trade.offering.special}</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-700">Requesting:</div>
                            <div>💰 {trade.requesting.funding}</div>
                            <div>🤝 {trade.requesting.collaboration}</div>
                            <div>⭐ {trade.requesting.special}</div>
                          </div>
                        </div>
                        
                        {!isExpired && trade.toPlayerId === currentPlayer?.id && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAcceptTrade(trade.id)}
                              className="flex-1 bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600"
                            >
                              {getText('accept', 'Accept')}
                            </button>
                            <button
                              onClick={() => handleRejectTrade(trade.id)}
                              className="flex-1 bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600"
                            >
                              {getText('reject', 'Reject')}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
