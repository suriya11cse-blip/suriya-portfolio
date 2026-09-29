import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.conf import settings
from django.utils import timezone
from .models import Message, PageView
from .forms import ContactForm


def index(request):
    """Main portfolio page."""
    try:
        PageView.objects.create(path=request.path)
    except Exception:
        pass
    return render(request, 'index.html')


@require_POST
def contact_api(request):
    """Handle contact form submission."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    form = ContactForm(data)
    if not form.is_valid():
        first_error = list(form.errors.values())[0][0]
        return JsonResponse({'error': str(first_error)}, status=400)

    ip = request.META.get('REMOTE_ADDR')
    msg = Message.objects.create(
        name=form.cleaned_data['name'],
        email=form.cleaned_data['email'],
        subject=form.cleaned_data.get('subject', ''),
        message=form.cleaned_data['message'],
        ip=ip,
    )
    return JsonResponse({'success': True, 'id': msg.id}, status=201)


@require_POST
def track_api(request):
    """Track page view."""
    try:
        data = json.loads(request.body)
        PageView.objects.create(path=data.get('path', '/'))
        return JsonResponse({'ok': True})
    except Exception:
        return JsonResponse({'ok': False})


def admin_messages(request):
    """Simple token-protected page to view messages."""
    token = request.GET.get('token', '')
    if token != settings.ADMIN_TOKEN:
        return render(request, 'admin_login.html', {'error': 'Wrong token' if token else ''})

    messages = Message.objects.all()
    views = PageView.objects.count()
    return render(request, 'admin_messages.html', {
        'messages': messages,
        'views': views,
        'total': messages.count(),
    })


def health(request):
    """Health check endpoint."""
    return JsonResponse({'status': 'ok', 'time': timezone.now().isoformat()})
