import React from 'react';

const styles = {
  draft: 'bg-[#050505] text-[#A0A0A0] border-[#252525]',
  submitted: 'bg-[#050505] text-[#00AEEF] border-[#00AEEF]/40',
  under_review: 'bg-[#050505] text-[#FFC107] border-[#FFC107]/40',
  edit_requested: 'bg-[#050505] text-[#FFC107] border-[#FFC107]/40',
  pending: 'bg-[#050505] text-[#FFC107] border-[#FFC107]/40',
  approved: 'bg-[#050505] text-[#00D084] border-[#00D084]/40',
  confirmed: 'bg-[#050505] text-[#00D084] border-[#00D084]/40',
  active: 'bg-[#050505] text-[#00D084] border-[#00D084]/40',
  allocated: 'bg-[#050505] text-[#00D084] border-[#00D084]/40',
  fully_allocated: 'bg-[#050505] text-[#00D084] border-[#00D084]/40',
  completed: 'bg-[#050505] text-[#00D084] border-[#00D084]/40',
  rejected: 'bg-[#050505] text-[#FF4D67] border-[#FF4D67]/40',
  returned: 'bg-[#050505] text-[#FF4D67] border-[#FF4D67]/40',
  partial: 'bg-[#050505] text-[#18BFFF] border-[#18BFFF]/40',
  partially_allocated: 'bg-[#050505] text-[#18BFFF] border-[#18BFFF]/40',
  shortage: 'bg-[#050505] text-[#FF4D67] border-[#FF4D67]/40',
};

function pretty(status) {
  if (!status) return 'DRAFT';
  return String(status).replace(/_/g, ' ').toUpperCase();
}

export default function Badge({ status, children }) {
  const key = String(status || 'draft').toLowerCase();
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider border ${styles[key] || styles.draft}`}>
      {children || pretty(status)}
    </span>
  );
}

